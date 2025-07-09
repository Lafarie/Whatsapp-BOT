const config = require('../config/config');
const CommandHandler = require('../handlers/commandHandler');
const GroupHandler = require('../handlers/groupHandler');
const MessageUtils = require('../utils/messageUtils');

class MessageHandler {
  constructor(client) {
    this.client = client;
    this.commandHandler = new CommandHandler(client);
    this.groupHandler = new GroupHandler(client);
  }

  async handleMessage(message) {
    try {
      const messageBody = message.body;
      
      // Log message details
      this.logMessage(message);
      
      // Handle different types of messages
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
