/**
 * @fileoverview API Reference Documentation
 * @description Complete API reference for the WhatsApp Bot system
 * @author Farhad Lafarie
 * @version 2.0.0
 */

/**
 * =============================================================================
 * EXTERNAL API INTEGRATIONS
 * =============================================================================
 */

/**
 * JokeAPI Integration
 * 
 * @namespace JokeAPI
 * @description External API for fetching random jokes
 */

/**
 * @typedef {Object} JokeResponse
 * @property {string} [joke] - Single-line joke (for type "single")
 * @property {string} [setup] - Joke setup (for type "twopart")
 * @property {string} [delivery] - Joke punchline (for type "twopart")
 * @property {string} type - Joke type: "single" or "twopart"
 * @property {string} category - Joke category
 * @property {boolean} safe - Whether joke is safe for work
 */

/**
 * Fetch Random Joke
 * 
 * @function getJoke
 * @memberof JokeAPI
 * @async
 * @param {Object} options - Request options
 * @param {string} options.categories - Comma-separated categories
 * @param {boolean} options.safeMode - Enable safe mode
 * @returns {Promise<JokeResponse>} Joke data
 * 
 * @example
 * // GET https://v2.jokeapi.dev/joke/Miscellaneous,Pun,Spooky?safe-mode
 * const joke = await axios.get(JOKE_API_URL);
 * // Response: { setup: "Why don't scientists trust atoms?", delivery: "Because they make up everything!", type: "twopart" }
 */

/**
 * SheetDB API Integration
 * 
 * @namespace SheetDB
 * @description Google Sheets API wrapper for data management
 */

/**
 * @typedef {Object} SheetRecord
 * @property {string} Name - Contact name
 * @property {string} Number - Phone number
 */

/**
 * @typedef {Object} BackupRecord
 * @property {string} Id - Auto-increment ID
 * @property {string} Date - ISO timestamp
 * @property {string} Name - Contact name
 * @property {string} Number - Phone number
 */

/**
 * Fetch Sheet Data
 * 
 * @function fetchData
 * @memberof SheetDB
 * @async
 * @returns {Promise<SheetRecord[]>} Array of sheet records
 * 
 * @example
 * // GET https://sheetdb.io/api/v1/n5of53ejptco6
 * const data = await fetch(sourceUrl);
 * // Response: [{ Name: "John Doe", Number: "0771234567" }]
 */

/**
 * Backup Data
 * 
 * @function backupData
 * @memberof SheetDB
 * @async
 * @param {BackupRecord[]} data - Data to backup
 * @returns {Promise<Object>} Backup result
 * 
 * @example
 * // POST https://sheetdb.io/api/v1/bwzepplqnn59m
 * const result = await fetch(backupUrl, {
 *   method: 'POST',
 *   body: JSON.stringify({ data: modifiedData })
 * });
 */

/**
 * Clear Sheet Data
 * 
 * @function clearData
 * @memberof SheetDB
 * @async
 * @returns {Promise<Object>} Delete result
 * 
 * @example
 * // DELETE https://sheetdb.io/api/v1/n5of53ejptco6/all
 * const result = await fetch(`${sourceUrl}/all`, { method: 'DELETE' });
 */

/**
 * =============================================================================
 * INTERNAL API STRUCTURES
 * =============================================================================
 */

/**
 * Message Object Structure
 * 
 * @typedef {Object} Message
 * @property {string} body - Message text content
 * @property {string} from - Sender WhatsApp ID (e.g., "94771234567@c.us")
 * @property {Object} key - Baileys message key
 * @property {string} key.remoteJid - Chat identifier
 * @property {boolean} key.fromMe - Whether message is from bot
 * @property {boolean} isGroup - Whether message is from a group chat
 * @property {Function} reply - Function to reply to message
 * @property {Function} getChat - Function to get chat information
 * @property {Function} getContact - Function to get contact information
 */

/**
 * Reply to Message
 * 
 * @function Message#reply
 * @async
 * @param {string} text - Reply text content
 * @returns {Promise<Object>} Sent message object
 * 
 * @example
 * await message.reply("Hello! How can I help you?");
 */

/**
 * Get Chat Information
 * 
 * @function Message#getChat
 * @async
 * @returns {Promise<Chat>} Chat details
 * 
 * @example
 * const chat = await message.getChat();
 * // Returns: { isGroup: false, name: "Private Chat" }
 */

/**
 * Get Contact Information
 * 
 * @function Message#getContact
 * @async
 * @returns {Promise<Contact>} Contact details
 * 
 * @example
 * const contact = await message.getContact();
 * // Returns: { number: "94771234567", name: "John Doe", pushname: "John", isMe: false }
 */

/**
 * Chat Object Structure
 * 
 * @typedef {Object} Chat
 * @property {boolean} isGroup - Whether chat is a group
 * @property {string} name - Chat or group name
 */

/**
 * Contact Object Structure
 * 
 * @typedef {Object} Contact
 * @property {string} number - Phone number without country code
 * @property {string} name - Contact display name
 * @property {string} pushname - WhatsApp push name
 * @property {boolean} isMe - Whether contact is the bot itself
 */

/**
 * Group Metadata Structure
 * 
 * @typedef {Object} GroupMetadata
 * @property {string} id - Group identifier
 * @property {string} subject - Group name/subject
 * @property {string} desc - Group description
 * @property {number} creation - Creation timestamp
 * @property {string} owner - Group owner identifier
 * @property {Participant[]} participants - Array of group participants
 */

/**
 * Participant Object Structure
 * 
 * @typedef {Object} Participant
 * @property {string} id - Participant WhatsApp ID
 * @property {boolean} isAdmin - Whether participant is admin
 * @property {boolean} isSuperAdmin - Whether participant is super admin
 */

/**
 * =============================================================================
 * COMMAND API REFERENCE
 * =============================================================================
 */

/**
 * Command Handler Interface
 * 
 * @interface ICommandHandler
 */

/**
 * Handle Help Command
 * 
 * @function ICommandHandler#handleHelpCommand
 * @async
 * @param {Message} message - Incoming message
 * @returns {Promise<void>}
 * 
 * @example
 * // User: "help"
 * // Bot: "Commands\n1. joke - Get a random joke\n2. add - Add users to group..."
 */

/**
 * Handle Joke Command
 * 
 * @function ICommandHandler#handleJokeCommand
 * @async
 * @param {Message} message - Incoming message
 * @returns {Promise<void>}
 * 
 * @example
 * // User: "joke"
 * // Bot: "Why don't scientists trust atoms?"
 * // Bot (after 5s): "Because they make up everything!"
 */

/**
 * Handle Add Command
 * 
 * @function ICommandHandler#handleAddCommand
 * @async
 * @param {Message} message - Incoming message
 * @returns {Promise<void>}
 * 
 * @example
 * // User: "add"
 * // Bot: "Add your Numbers to this link: https://docs.google.com/..."
 * // Bot: "After adding the numbers to that link\nNow use following format..."
 */

/**
 * Handle Group Add Command
 * 
 * @function ICommandHandler#handleGroupAddCommand
 * @async
 * @param {Message} message - Incoming message with group name
 * @returns {Promise<void>}
 * 
 * @example
 * // User: "!add My Test Group"
 * // Bot processes numbers from sheet and adds to "My Test Group"
 * // Bot: "Total numbers counted: 5\nParticipants added successfully: 3..."
 */

/**
 * =============================================================================
 * SERVICE API REFERENCE
 * =============================================================================
 */

/**
 * Group Service Statistics
 * 
 * @typedef {Object} GroupStats
 * @property {number} successCount - Successfully added participants
 * @property {number} alreadyParticipants - Already existing participants
 * @property {string[]} errorNumbers - Numbers that failed to add
 * @property {string[]} noWhatsappNumbers - Numbers without WhatsApp
 * @property {number} totalNumbers - Total numbers processed
 */

/**
 * Add Participants to Group
 * 
 * @function GroupService#addParticipantsToGroup
 * @async
 * @param {string} groupName - Target group name
 * @param {string[]} numbers - WhatsApp numbers to add
 * @returns {Promise<GroupStats>} Operation statistics
 * 
 * @example
 * const stats = await groupService.addParticipantsToGroup("Test Group", [
 *   "94771234567@c.us",
 *   "94712345678@c.us"
 * ]);
 * // Returns: { successCount: 1, alreadyParticipants: 1, errorNumbers: [], ... }
 */

/**
 * =============================================================================
 * UTILITY API REFERENCE
 * =============================================================================
 */

/**
 * Message Utilities
 * 
 * @namespace MessageUtils
 */

/**
 * Check if Message is Command
 * 
 * @function MessageUtils.isCommand
 * @param {Message} message - Message to check
 * @param {string[]} commands - Array of command variants
 * @returns {boolean} Whether message matches command
 * 
 * @example
 * const isHelp = MessageUtils.isCommand(message, ["help", "!help"]);
 * // Returns true if message.body is "help" or "!help"
 */

/**
 * Check if Message is from Admin
 * 
 * @function MessageUtils.isFromAdmin
 * @async
 * @param {Message} message - Message to check
 * @returns {Promise<boolean>} Whether sender is admin
 * 
 * @example
 * const isAdmin = await MessageUtils.isFromAdmin(message);
 * // Returns true if sender matches config.bot.adminNumber
 */

/**
 * Format Phone Number for WhatsApp
 * 
 * @function MessageUtils.formatPhoneNumber
 * @param {string} number - Raw phone number
 * @returns {string} Formatted WhatsApp number
 * 
 * @example
 * const formatted = MessageUtils.formatPhoneNumber("0771234567");
 * // Returns: "94771234567@c.us"
 */

/**
 * =============================================================================
 * ERROR HANDLING API
 * =============================================================================
 */

/**
 * Standard Error Response
 * 
 * @typedef {Object} ErrorResponse
 * @property {string} error - Error type
 * @property {string} message - Human-readable error message
 * @property {string} [details] - Additional error details
 * @property {number} timestamp - Error timestamp
 */

/**
 * Common Error Types
 * 
 * @enum {string}
 */
const ErrorTypes = {
  /** Group not found or not accessible */
  GROUP_NOT_FOUND: 'GROUP_NOT_FOUND',
  
  /** Bot lacks admin permissions */
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  /** External API unavailable */
  API_UNAVAILABLE: 'API_UNAVAILABLE',
  
  /** Invalid phone number format */
  INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
  
  /** User not found on WhatsApp */
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  
  /** Rate limit exceeded */
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
};

/**
 * =============================================================================
 * CONFIGURATION API
 * =============================================================================
 */

/**
 * Bot Configuration
 * 
 * @typedef {Object} BotConfig
 * @property {Object} bot - Bot-specific settings
 * @property {string} bot.myNumber - Bot's WhatsApp number
 * @property {string} bot.adminNumber - Admin's WhatsApp number
 * @property {Object} api - External API configurations
 * @property {string} api.jokeApi - Joke API endpoint
 * @property {Object} api.sheetDb - SheetDB configuration
 * @property {Object} behavior - Bot behavior settings
 * @property {string[]} behavior.greetings - Greeting trigger words
 * @property {Object} behavior.timeouts - Timing configurations
 * @property {Object} commands - Command mappings
 */

/**
 * Load Configuration
 * 
 * @function loadConfig
 * @returns {BotConfig} Complete bot configuration
 * 
 * @example
 * const config = require('./config/config');
 * console.log(config.bot.myNumber); // "94771234567@c.us"
 */

module.exports = {
  ErrorTypes,
  // Type definitions exported for TypeScript compatibility
};
