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
    return {
      body: baileysMessage.message?.conversation || 
            baileysMessage.message?.extendedTextMessage?.text || '',
      from: baileysMessage.key.remoteJid,
      key: baileysMessage.key,
      isGroup: baileysMessage.key.remoteJid.includes('@g.us'),
      reply: async (text) => {
        await this.client.sendMessage(baileysMessage.key.remoteJid, { text });
      },
      getChat: async () => ({
        isGroup: baileysMessage.key.remoteJid.includes('@g.us'),
        name: 'Unknown' // We'd need to implement group name fetching
      }),
      getContact: async () => ({
        number: baileysMessage.key.remoteJid.split('@')[0],
        name: 'Unknown',
        pushname: 'Unknown',
        isMe: baileysMessage.key.fromMe
      })
    };
  }

  async logMessage(message) {
    try {
      const check = message.body;
      const group = await message.getChat();
      const contact = await message.getContact();
      
      console.log(
        `${check}\n${contact.number} ${contact.name} ${contact.pushname} ${group.name}\n`
      );
    } catch (error) {
      console.error('Error logging message:', error);
    }
  }
}

module.exports = MessageHandler;
