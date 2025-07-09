const config = require('../config/config');
const jokeService = require('../services/jokeService');
const MessageUtils = require('../utils/messageUtils');

class CommandHandler {
  constructor(client) {
    this.client = client;
  }

  async handleHelpCommand(message) {
    try {
      const helpText = `🤖 *Farhad's WhatsApp Bot Commands*

*Basic Commands:*
• !joke - Get a random joke
• !add - Add users to group
• !admin - Admin commands
• !clearai - Clear chat history with AI

*AI Features:*
✨ Just chat normally! I'll respond as Farhad
• Works in private chats automatically
• In groups, mention "farhad" or "bot" to get my attention
• I remember our conversation context
• Use !clearai to start fresh

*Note:* This bot responds as if you're chatting directly with Farhad!`;
      await message.reply(helpText);
    } catch (error) {
      console.error('Error handling help command:', error);
      await message.reply('Sorry, there was an error processing your request.');
    }
  }

  async handleJokeCommand(message) {
    try {
      await jokeService.sendJoke(message);
    } catch (error) {
      console.error('Error handling joke command:', error);
      await message.reply('Sorry, I could not fetch a joke at this time.');
    }
  }

  async handleAddCommand(message) {
    try {
      const instructionsMsg = await message.reply(
        `Add your Numbers to this link:\n${config.api.sheetDb.googleSheetUrl}\n\nMake sure I'm in that group and have permission to add participants.`
      );
      
      await instructionsMsg.reply(
        `After adding the numbers to that link\nNow use the following format to add users:\n\nExample:\n\n*!add Group Name* ♥\n\nMake sure to input the group name without any mistakes (include emojis if any)`
      );
    } catch (error) {
      console.error('Error handling add command:', error);
      await message.reply('Sorry, there was an error processing your request.');
    }
  }

  async handleAdminCommand(message) {
    try {
      const isAdmin = await MessageUtils.isFromAdmin(message);
      
      if (isAdmin) {
        await message.reply("Hey boss, what's up?");
        await message.reply("Admin commands are still not available but coming soon!\n1. View stats\n2. Manage users\n3. Configure settings");
      } else {
        await message.reply("Nice try! You almost got me, haha. You're not an admin.");
      }
    } catch (error) {
      console.error('Error handling admin command:', error);
      await message.reply('Sorry, there was an error processing your request.');
    }
  }

  async handleGreeting(message) {
    try {
      const isGroup = await MessageUtils.isGroupMessage(message);
      
      if (!isGroup) {
        await message.reply("HI, I'm Farhad's Chat bot. If you need more help, type 'help'");
      }
    } catch (error) {
      console.error('Error handling greeting:', error);
    }
  }

  async handleDeleteRequest(message) {
    try {
      const isGroup = await MessageUtils.isGroupMessage(message);
      
      if (!isGroup) {
        const messageBody = message.body.toLowerCase();
        
        if (messageBody.includes("delete this")) {
          await message.reply("ok ok");
        } else if (messageBody.includes("delete")) {
          await message.reply("ok ok, I shared you because it looks cute 😒");
        }
      }
    } catch (error) {
      console.error('Error handling delete request:', error);
    }
  }
}

module.exports = CommandHandler;
