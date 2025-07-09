/**
 * @fileoverview Message Handler Documentation
 * @description Central message processing and routing system for the WhatsApp bot
 * @author Farhad Lafarie
 * @version 2.0.0
 */

/**
 * Message Handler Class
 * 
 * Acts as the central nervous system of the bot, receiving all incoming messages
 * and routing them to appropriate handlers based on content and context.
 * Provides compatibility layer between Baileys and the bot's internal message format.
 * 
 * @class MessageHandler
 */
class MessageHandler {
  /**
   * Create a MessageHandler instance
   * 
   * @param {Object} client - WhatsApp client instance (Baileys socket)
   */
  constructor(client) {
    this.client = client;
    this.commandHandler = new CommandHandler(client);
    this.groupHandler = new GroupHandler(client);
  }

  /**
   * Main Message Processing Function
   * 
   * Routes incoming messages to appropriate handlers based on content analysis.
   * Performs message logging and error handling.
   * 
   * @async
   * @param {Object} message - Standardized message object
   * @param {string} message.body - Message text content
   * @param {string} message.from - Sender identifier
   * @param {boolean} message.isGroup - Whether message is from a group
   * @param {Function} message.reply - Function to reply to message
   * @param {Function} message.getChat - Function to get chat information
   * @param {Function} message.getContact - Function to get contact information
   * 
   * @returns {Promise<void>}
   * 
   * @example
   * // Process an incoming message
   * const message = {
   *   body: "hello",
   *   from: "94771234567@c.us",
   *   reply: async (text) => await client.sendMessage(from, {text})
   * };
   * await messageHandler.handleMessage(message);
   */
  async handleMessage(message) {
    try {
      const messageBody = message.body;
      
      // Log message details for debugging and monitoring
      this.logMessage(message);
      
      // Route messages based on content analysis
      if (MessageUtils.isCommand(message, config.commands.help)) {
        await this.commandHandler.handleHelpCommand(message);
      } 
      else if (MessageUtils.isCommand(message, config.commands.joke)) {
        await this.commandHandler.handleJokeCommand(message);
      }
      else if (MessageUtils.isCommand(message, config.commands.add)) {
        await this.commandHandler.handleAddCommand(message);
      }
      else if (MessageUtils.isCommand(message, config.commands.admin)) {
        await this.commandHandler.handleAdminCommand(message);
      }
      else if (this.groupHandler.isGroupAddCommand(messageBody)) {
        await this.groupHandler.handleGroupAddCommand(message);
      }
      else if (MessageUtils.isGreeting(message)) {
        await this.commandHandler.handleGreeting(message);
      }
      else if (messageBody.toLowerCase().includes("delete")) {
        await this.commandHandler.handleDeleteRequest(message);
      }
      
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  /**
   * Baileys Message Adapter
   * 
   * Handles messages from Baileys library and converts them to our standard format.
   * Provides compatibility layer for different message structures.
   * 
   * @async
   * @param {Object} message - Raw Baileys message object
   * @param {Object} message.key - Message key with sender and chat info
   * @param {Object} message.message - Message content and metadata
   * @param {string} message.pushName - Sender's display name
   * 
   * @returns {Promise<void>}
   * 
   * @example
   * // Handle a raw Baileys message
   * const baileysMessage = {
   *   key: { remoteJid: "94771234567@c.us", fromMe: false },
   *   message: { conversation: "hello" },
   *   pushName: "John Doe"
   * };
   * await messageHandler.handleBaileysMessage(baileysMessage);
   */
  async handleBaileysMessage(message) {
    try {
      // Convert Baileys message to our standard format
      const standardMessage = this.convertBaileysMessage(message);
      await this.handleMessage(standardMessage);
    } catch (error) {
      console.error('Error handling Baileys message:', error);
    }
  }

  /**
   * Baileys to Standard Message Converter
   * 
   * Transforms Baileys message structure into our standardized message format.
   * Handles various message types and provides unified interface.
   * 
   * @param {Object} baileysMessage - Raw Baileys message
   * @returns {Object} Standardized message object
   * 
   * @example
   * const standardMessage = messageHandler.convertBaileysMessage(baileysMessage);
   * // Returns: { body: "hello", from: "94771234567@c.us", reply: Function, ... }
   */
  convertBaileysMessage(baileysMessage) {
    // Extract message text from various message types
    const messageText = this.extractMessageText(baileysMessage);
    const remoteJid = baileysMessage.key.remoteJid;
    const isGroup = remoteJid.includes('@g.us');
    const phoneNumber = remoteJid.split('@')[0];
    
    return {
      body: messageText,
      from: remoteJid,
      key: baileysMessage.key,
      isGroup: isGroup,
      
      /**
       * Reply to Message
       * @param {string} text - Reply text
       * @returns {Promise<void>}
       */
      reply: async (text) => {
        await this.client.sendMessage(remoteJid, { text });
      },
      
      /**
       * Get Chat Information
       * @returns {Promise<Object>} Chat details
       */
      getChat: async () => {
        if (isGroup) {
          try {
            const groupMetadata = await this.client.groupMetadata(remoteJid);
            return {
              isGroup: true,
              name: groupMetadata.subject || 'Unknown Group'
            };
          } catch (error) {
            return {
              isGroup: true,
              name: 'Unknown Group'
            };
          }
        } else {
          return {
            isGroup: false,
            name: 'Private Chat'
          };
        }
      },
      
      /**
       * Get Contact Information
       * @returns {Promise<Object>} Contact details
       */
      getContact: async () => {
        try {
          const contactInfo = await this.client.onWhatsApp(phoneNumber);
          const pushName = baileysMessage.pushName || 'Unknown';
          
          return {
            number: phoneNumber,
            name: pushName,
            pushname: pushName,
            isMe: baileysMessage.key.fromMe || false
          };
        } catch (error) {
          return {
            number: phoneNumber,
            name: baileysMessage.pushName || 'Unknown',
            pushname: baileysMessage.pushName || 'Unknown',
            isMe: baileysMessage.key.fromMe || false
          };
        }
      }
    };
  }

  /**
   * Extract Text from Baileys Message
   * 
   * Handles various WhatsApp message types and extracts text content.
   * Supports text, image captions, video captions, and document captions.
   * 
   * @param {Object} baileysMessage - Raw Baileys message
   * @returns {string} Extracted message text
   * 
   * @example
   * const text = messageHandler.extractMessageText(baileysMessage);
   * // Returns: "Hello world" or "" for non-text messages
   */
  extractMessageText(baileysMessage) {
    const message = baileysMessage.message;
    if (!message) return '';

    // Handle different message types
    if (message.conversation) {
      return message.conversation;
    }
    
    if (message.extendedTextMessage?.text) {
      return message.extendedTextMessage.text;
    }
    
    if (message.imageMessage?.caption) {
      return message.imageMessage.caption;
    }
    
    if (message.videoMessage?.caption) {
      return message.videoMessage.caption;
    }
    
    if (message.documentMessage?.caption) {
      return message.documentMessage.caption;
    }

    // For other message types, return empty string
    return '';
  }

  /**
   * Message Logging Function
   * 
   * Logs incoming messages with sender details for debugging and monitoring.
   * Formats log output for easy reading and troubleshooting.
   * 
   * @async
   * @param {Object} message - Message to log
   * @returns {Promise<void>}
   * 
   * @example
   * // Logs: "📨 Message from John Doe (94771234567) in Private Chat: "hello""
   * await messageHandler.logMessage(message);
   */
  async logMessage(message) {
    try {
      const messageBody = message.body || '';
      const chat = await message.getChat();
      const contact = await message.getContact();
      
      const logInfo = {
        message: messageBody,
        from: contact.number || 'Unknown',
        name: contact.name || contact.pushname || 'Unknown',
        chat: chat.name || (chat.isGroup ? 'Group Chat' : 'Private Chat'),
        isGroup: chat.isGroup || false
      };
      
      console.log(`📨 Message from ${logInfo.name} (${logInfo.from}) in ${logInfo.chat}: "${messageBody}"`);
    } catch (error) {
      console.error('Error logging message:', error);
      // Fallback logging
      console.log(`📨 Message: "${message.body || 'Unknown message'}"`);
    }
  }
}

/**
 * Message Flow Architecture
 * 
 * 1. Raw Baileys message received
 * 2. Convert to standard format
 * 3. Extract message content
 * 4. Analyze message type/command
 * 5. Route to appropriate handler
 * 6. Log message details
 * 7. Handle errors gracefully
 */

/**
 * Supported Message Types
 * 
 * @typedef {Object} MessageTypes
 * @property {string} conversation - Simple text message
 * @property {Object} extendedTextMessage - Rich text with formatting
 * @property {Object} imageMessage - Image with optional caption
 * @property {Object} videoMessage - Video with optional caption
 * @property {Object} documentMessage - Document with optional caption
 */

/**
 * Message Routing Logic
 * 
 * Messages are routed based on:
 * - Command keywords (help, joke, add, admin)
 * - Content analysis (greetings, delete requests)
 * - Special patterns (group addition commands)
 * - Fallback handling for unrecognized content
 */

/**
 * Error Handling Strategy
 * 
 * - Graceful degradation on conversion errors
 * - Fallback logging when detailed logging fails
 * - Isolated error handling per message
 * - No message processing failures affect other messages
 */

module.exports = MessageHandler;
