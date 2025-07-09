const config = require('../config/config');
const sheetDBService = require('../services/sheetDBService');

class GroupService {
  constructor(client) {
    this.client = client;
    this.stats = {
      successCount: 0,
      alreadyParticipants: 0,
      errorNumbers: [],
      noWhatsappNumbers: [],
      totalNumbers: 0
    };
  }

  resetStats() {
    this.stats = {
      successCount: 0,
      alreadyParticipants: 0,
      errorNumbers: [],
      noWhatsappNumbers: [],
      totalNumbers: 0
    };
  }

  async findGroup(groupName) {
    try {
      const chats = await this.client.getChats();
      const group = chats.find((chat) => chat.name === groupName);
      
      if (!group) {
        throw new Error("Group not found");
      }
      
      if (!group.isGroup) {
        throw new Error("Chat is not a group");
      }
      
      return group;
    } catch (error) {
      console.error('Error finding group:', error);
      throw error;
    }
  }

  async checkBotAdminStatus(group) {
    try {
      const participant = group.groupMetadata.participants.find(
        (participant) => participant.id._serialized === config.bot.myNumber
      );
      
      if (!participant || !participant.isAdmin) {
        throw new Error(`Bot is not admin in group: ${group.name}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      throw error;
    }
  }

  async addParticipantsToGroup(groupName, numbers) {
    try {
      this.resetStats();
      this.stats.totalNumbers = numbers.length;
      
      const group = await this.findGroup(groupName);
      await this.checkBotAdminStatus(group);
      
      if (numbers.length === 0) {
        throw new Error("No numbers to add");
      }

      for (const number of numbers) {
        await this.addSingleParticipant(group, number);
      }
      
      return this.stats;
    } catch (error) {
      console.error('Error adding participants:', error);
      throw error;
    }
  }

  async addSingleParticipant(group, number) {
    try {
      const contact = await this.client.getContactById(number);
      const existingParticipant = group.groupMetadata.participants.find(
        (participant) => participant.id._serialized === number
      );

      if (!contact.isWAContact) {
        this.stats.noWhatsappNumbers.push(number);
        return;
      }

      if (existingParticipant) {
        this.stats.alreadyParticipants++;
        return;
      }

      await group.addParticipants([number]);
      this.stats.successCount++;
      
    } catch (error) {
      this.stats.errorNumbers.push(number);
      console.error(`Error adding participant ${number}:`, error);
    }
  }

  async sendStatusReport(message) {
    const { from } = message;
    const { 
      totalNumbers, 
      successCount, 
      alreadyParticipants, 
      errorNumbers, 
      noWhatsappNumbers 
    } = this.stats;

    try {
      await this.client.sendMessage(from, `Total numbers counted: ${totalNumbers}`);
      await this.client.sendMessage(from, `Participants added successfully: ${successCount}`);
      await this.client.sendMessage(from, `Already participants: ${alreadyParticipants}`);

      if (errorNumbers.length > 0) {
        await this.client.sendMessage(from, `Errors count when adding: ${errorNumbers.length}`);
        await this.client.sendMessage(from, `Error numbers: ${errorNumbers.join(', ')}`);
      }

      if (noWhatsappNumbers.length > 0) {
        await this.client.sendMessage(from, `No WhatsApp count: ${noWhatsappNumbers.length}`);
        await this.client.sendMessage(from, `No WhatsApp numbers: ${noWhatsappNumbers.join(', ')}`);
      }

      if (errorNumbers.length > 0) {
        await this.client.sendMessage(
          from,
          `2 reasons why errors can occur:\n1. Numbers are not correct\n2. Users are not using WhatsApp`
        );
      }

      const chat = await message.getChat();
      if (chat.isGroup) {
        await message.reply("All information sent to you privately");
      }
    } catch (error) {
      console.error('Error sending status report:', error);
    }
  }
}

module.exports = GroupService;
