const config = require('../config/config');
const CommandHandler = require('../handlers/commandHandler');
const GroupHandler = require('../handlers/groupHandler');
const MessageUtils = require('../utils/messageUtils');
const aiService = require('../services/aiService');

class MessageHandler {
  constructor(client) {
    this.client = client;
    this.commandHandler = new CommandHandler(client);
    this.groupHandler = new GroupHandler(client);
  }

  async handleMessage(message) {
    try {
      const messageBody = message.body;
      let commandHandled = false;
      
      // Log message details
      this.logMessage(message);
      
      // Handle different types of messages
      if (MessageUtils.isCommand(message, config.commands.help)) {
        await this.commandHandler.handleHelpCommand(message);
        commandHandled = true;
      } 
      else if (MessageUtils.isCommand(message, config.commands.joke)) {
        await this.commandHandler.handleJokeCommand(message);
        commandHandled = true;
      }
      else if (MessageUtils.isCommand(message, config.commands.add)) {
        await this.commandHandler.handleAddCommand(message);
        commandHandled = true;
      }
      else if (MessageUtils.isCommand(message, config.commands.admin)) {
        await this.commandHandler.handleAdminCommand(message);
        commandHandled = true;
      }
      else if (MessageUtils.isCommand(message, config.commands.clearai)) {
        await this.handleClearAICommand(message);
        commandHandled = true;
      }
      else if (this.groupHandler.isGroupAddCommand(messageBody)) {
        await this.groupHandler.handleGroupAddCommand(message);
        commandHandled = true;
      }
      else if (MessageUtils.isGreeting(message)) {
        await this.commandHandler.handleGreeting(message);
        commandHandled = true;
      }
      else if (messageBody.toLowerCase().includes("delete")) {
        await this.commandHandler.handleDeleteRequest(message);
        commandHandled = true;
      }
      
      // If no command was handled and AI is enabled, try AI response
      if (!commandHandled && config.ai.enabled) {
        await this.handleAIResponse(message);
      }
      
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async handleBaileysMessage(message) {
    try {
      // Convert Baileys message to our standard format
      const standardMessage = this.convertBaileysMessage(message);
      await this.handleMessage(standardMessage);
    } catch (error) {
      console.error('Error handling Baileys message:', error);
    }
  }

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
      reply: async (text) => {
        await this.client.sendMessage(remoteJid, { text });
      },
      getChat: async () => {
        if (isGroup) {
          // For groups, try to get group metadata
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
      getContact: async () => {
        try {
          // Try to get contact info from WhatsApp
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

  async handleAIResponse(message) {
    try {
      const messageBody = message.body;
      const chat = await message.getChat();
      const contact = await message.getContact();
      const isGroup = chat.isGroup;
      
      // Check if we should respond with AI
      if (!aiService.shouldRespondWithAI(messageBody, isGroup)) {
        return;
      }
      
      // Don't respond to own messages
      if (contact.isMe) {
        return;
      }
      
      console.log(`🤖 Generating AI response for ${contact.name || contact.number}`);
      
      // Generate AI response
      const aiResponse = await aiService.generateResponse(
        messageBody,
        contact.number || contact.from,
        contact.name || contact.pushname || 'friend'
      );
      
      if (aiResponse) {
        await message.reply(aiResponse);
        console.log(`✅ AI response sent: "${aiResponse}"`);
      }
      
    } catch (error) {
      console.error('Error handling AI response:', error);
      // Send a friendly fallback message
      try {
        await message.reply("Hey! I'm having some tech issues right now. Can you try again? 😅");
      } catch (replyError) {
        console.error('Error sending fallback message:', replyError);
      }
    }
  }

  async handleClearAICommand(message) {
    try {
      const contact = await message.getContact();
      const userNumber = contact.number || contact.from;
      
      aiService.clearConversationHistory(userNumber);
      await message.reply("✅ Cleared our conversation history! Starting fresh 🧹");
      
      console.log(`🗑️ Cleared AI conversation history for ${contact.name || userNumber}`);
    } catch (error) {
      console.error('Error clearing AI conversation:', error);
      await message.reply("Oops, couldn't clear the conversation history. Try again!");
    }
  }

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

module.exports = MessageHandler;
