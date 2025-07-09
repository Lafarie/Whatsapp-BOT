const axios = require('axios');
const config = require('./config');

class CommandHandler {
  constructor(client) {
    this.client = client;
  }

  async handleMessage(message) {
    const command = message.body.toLowerCase().trim();
    const chat = await message.getChat();
    
    try {
      // Handle greetings
      if (config.GREETINGS.includes(command) && !chat.isGroup) {
        return message.reply(config.MESSAGES.GREETING_REPLY);
      }

      // Handle help command
      if (config.COMMANDS.HELP.includes(command)) {
        return message.reply(config.MESSAGES.HELP_MENU);
      }

      // Handle joke command
      if (config.COMMANDS.JOKE.includes(command)) {
        return this.handleJokeCommand(message);
      }

      // Handle add command
      if (command === '!add' || command === 'add') {
        return this.handleAddCommand(message);
      }

      // Handle admin command
      if (command === '!admin') {
        return this.handleAdminCommand(message);
      }

      // Handle group add command
      if (command.startsWith('!add') && command.length > 9) {
        return this.handleGroupAddCommand(message);
      }

    } catch (error) {
      console.error('Error handling message:', error);
      message.reply('Sorry, I encountered an error processing your request.');
    }
  }

  async handleJokeCommand(message) {
    try {
      const response = await axios.get(config.JOKE_API_URL);
      const joke = response.data;
      
      const jokeMsg = await message.reply(joke.setup || joke.joke);
      
      if (joke.delivery) {
        setTimeout(() => {
          jokeMsg.reply(joke.delivery);
        }, 3000);
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
      message.reply('Sorry, I could not fetch a joke at this time.');
    }
  }

  async handleAddCommand(message) {
    const instructions = `Add your Numbers to this link:
https://docs.google.com/spreadsheets/d/1uppXgyuMYAtA7QgzDhWkEmHdN7yvuG1QhJoRCs3db1s/edit?usp=sharing

Make sure I'm in that group and have permission to add participants.

After adding the numbers, use this format:
*!add Group Name*

Make sure to input the group name without any mistakes (include emojis if any).`;

    message.reply(instructions);
  }

  async handleAdminCommand(message) {
    try {
      const contact = await message.getContact();
      
      if (contact.isMe) {
        message.reply("Hey boss, what's up?");
        message.reply("Admin commands are still not available but some following:\n1. Coming soon...");
      } else {
        message.reply(config.MESSAGES.ADMIN_ONLY);
      }
    } catch (error) {
      console.error('Error in admin command:', error);
      message.reply('Error processing admin command.');
    }
  }

  async handleGroupAddCommand(message) {
    // This would be the refactored group add functionality
    // Implementation would go here with proper error handling
    message.reply('Group add functionality is being refactored for better reliability.');
  }
}

module.exports = CommandHandler;
