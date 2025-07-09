const config = require('../config/config');
const GroupService = require('../services/groupService');
const sheetDBService = require('../services/sheetDBService');
const MessageUtils = require('../utils/messageUtils');

class GroupHandler {
  constructor(client) {
    this.client = client;
    this.groupService = new GroupService(client);
  }

  async handleGroupAddCommand(message) {
    try {
      const messageBody = message.body;
      
      // Validate input
      if (messageBody[0] === " ") {
        await this.client.sendMessage(
          message.from,
          "Please no space at the start. I'm lazy to validate them."
        );
        return;
      }

      const groupName = MessageUtils.extractGroupName(messageBody);
      if (!groupName) {
        await message.reply("Please provide a group name. Format: !add Group Name");
        return;
      }

      // Check if group exists and bot has admin rights
      try {
        const group = await this.groupService.findGroup(groupName);
        await this.groupService.checkBotAdminStatus(group);
      } catch (error) {
        await message.reply(error.message);
        return;
      }

      // Fetch numbers from sheet
      let numbers;
      try {
        numbers = await sheetDBService.fetchNumbers();
        if (numbers.length === 0) {
          await message.reply("No numbers found in the sheet");
          return;
        }
      } catch (error) {
        await message.reply(error.message);
        return;
      }

      // Process participants asynchronously
      this.processGroupParticipants(message, groupName, numbers);
      
    } catch (error) {
      console.error('Error handling group add command:', error);
      await message.reply('Sorry, there was an error processing your request.');
    }
  }

  async processGroupParticipants(message, groupName, numbers) {
    try {
      // Wait a bit before processing
      await MessageUtils.delay(config.behavior.timeouts.dataProcessing);
      
      // Add participants
      const stats = await this.groupService.addParticipantsToGroup(groupName, numbers);
      
      // Backup and clean data
      try {
        await sheetDBService.backupData();
        await sheetDBService.clearSourceData();
      } catch (error) {
        console.error('Error with sheet operations:', error);
        await message.reply('Participants processed, but there was an issue with sheet cleanup.');
      }
      
      // Send status report after a delay
      setTimeout(async () => {
        await this.groupService.sendStatusReport(message);
      }, config.behavior.timeouts.statusReport);
      
    } catch (error) {
      console.error('Error processing group participants:', error);
      await message.reply('There was an error processing the participants.');
    }
  }

  isGroupAddCommand(messageBody) {
    return messageBody.toLowerCase().startsWith("!add") && messageBody.length > 9;
  }
}

module.exports = GroupHandler;
