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
