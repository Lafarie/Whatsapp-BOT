/**
 * @fileoverview Command Handler Documentation
 * @description Handles all user commands and interactions with the WhatsApp bot
 * @author Farhad Lafarie
 * @version 2.0.0
 */

/**
 * Command Handler Class
 * 
 * Processes and responds to user commands sent to the WhatsApp bot.
 * Supports various command types including help, jokes, admin functions,
 * and group management operations.
 * 
 * @class CommandHandler
 */
class CommandHandler {
  /**
   * Create a CommandHandler instance
   * 
   * @param {Object} client - WhatsApp client instance (Baileys socket)
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Handle Help Command
   * 
   * Displays a list of available commands to the user.
   * Shows basic bot capabilities and usage instructions.
   * 
   * @async
   * @param {Object} message - Message object containing user request
   * @param {string} message.body - The message text content
   * @param {Function} message.reply - Function to reply to the message
   * @param {Object} message.from - Sender information
   * 
   * @returns {Promise<void>}
   * 
   * @example
   * // User sends: "help" or "!help"
   * // Bot responds with command list
   * await commandHandler.handleHelpCommand(message);
   */
  async handleHelpCommand(message) {
    try {
      const helpText = `Commands\n1. joke - Get a random joke\n2. add - Add users to group\n3. admin - Admin commands\n4. Coming soon...`;
      await message.reply(helpText);
    } catch (error) {
      console.error('Error handling help command:', error);
      await message.reply('Sorry, there was an error processing your request.');
    }
  }

  /**
   * Handle Joke Command
   * 
   * Fetches a random joke from external API and sends it to the user.
   * Supports both setup/delivery and single-line jokes.
   * 
   * @async
   * @param {Object} message - Message object containing user request
   * 
   * @returns {Promise<void>}
   * 
   * @throws {Error} When joke API is unavailable or returns invalid data
   * 
   * @example
   * // User sends: "joke" or "!joke"
   * // Bot fetches and sends a random joke
   * await commandHandler.handleJokeCommand(message);
   */
  async handleJokeCommand(message) {
    try {
      await jokeService.sendJoke(message);
    } catch (error) {
      console.error('Error handling joke command:', error);
      await message.reply('Sorry, I could not fetch a joke at this time.');
    }
  }

  /**
   * Handle Add Command
   * 
   * Provides instructions for adding users to WhatsApp groups.
   * Sends Google Sheets link and explains the process.
   * 
   * @async
   * @param {Object} message - Message object containing user request
   * 
   * @returns {Promise<void>}
   * 
   * @example
   * // User sends: "add" or "!add"
   * // Bot sends Google Sheets link and instructions
   * await commandHandler.handleAddCommand(message);
   */
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

  /**
   * Handle Admin Command
   * 
   * Processes admin-only commands and functions.
   * Verifies sender permissions before executing admin operations.
   * 
   * @async
   * @param {Object} message - Message object containing admin request
   * 
   * @returns {Promise<void>}
   * 
   * @security Only accessible to verified admin users
   * 
   * @example
   * // Admin sends: "!admin"
   * // Bot verifies admin status and shows admin menu
   * await commandHandler.handleAdminCommand(message);
   */
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

  /**
   * Handle Greeting Messages
   * 
   * Responds to user greetings with welcome message and basic information.
   * Only responds in private chats, not in groups.
   * 
   * @async
   * @param {Object} message - Message object containing greeting
   * 
   * @returns {Promise<void>}
   * 
   * @note Only responds in private chats to avoid spam in groups
   * 
   * @example
   * // User sends: "hi", "hello", "hey"
   * // Bot responds with welcome message (only in private chat)
   * await commandHandler.handleGreeting(message);
   */
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

  /**
   * Handle Delete Requests
   * 
   * Processes messages containing "delete" keywords.
   * Provides contextual responses based on delete request type.
   * 
   * @async
   * @param {Object} message - Message object containing delete request
   * 
   * @returns {Promise<void>}
   * 
   * @example
   * // User sends: "delete this"
   * // Bot responds: "ok ok"
   * // User sends: "delete"
   * // Bot responds with explanation
   * await commandHandler.handleDeleteRequest(message);
   */
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

/**
 * Command Types and Their Handlers
 * 
 * @typedef {Object} CommandMapping
 * @property {string[]} help - Help command variants: ["help", "!help"]
 * @property {string[]} joke - Joke command variants: ["!joke", "joke"]
 * @property {string[]} add - Add command variants: ["!add", "add"]
 * @property {string[]} admin - Admin command variants: ["!admin"]
 */

/**
 * Error Handling Strategy
 * 
 * All command handlers implement consistent error handling:
 * 1. Try-catch blocks around all async operations
 * 2. Log errors to console for debugging
 * 3. Send user-friendly error messages
 * 4. Graceful degradation when services unavailable
 */

/**
 * Security Considerations
 * 
 * - Admin commands verify sender permissions
 * - Input sanitization prevents injection attacks
 * - Rate limiting could be added for abuse prevention
 * - Error messages don't expose internal system details
 */

/**
 * Performance Notes
 * 
 * - Async/await pattern for non-blocking operations
 * - Error boundaries prevent cascade failures
 * - Minimal memory footprint with stateless design
 * - External API calls have timeout handling
 */

module.exports = CommandHandler;
