const config = require('../config/config');

class MessageUtils {
  static isCommand(message, commands) {
    return commands.some(cmd => 
      message.body.toLowerCase() === cmd || 
      message.body.toLowerCase().startsWith(cmd + ' ')
    );
  }

  static isGreeting(message) {
    return config.behavior.greetings.includes(message.body.toLowerCase());
  }

  static isBadWord(message) {
    return config.behavior.badWords.includes(message.body.toLowerCase());
  }

  static extractGroupName(messageBody) {
    const spaceIndex = messageBody.indexOf(' ');
    return spaceIndex > -1 ? messageBody.slice(spaceIndex + 1) : '';
  }

  static isValidSheetURL(url) {
    return url.includes("https://sheetdb.io/");
  }

  static async isFromAdmin(message) {
    try {
      const contact = await message.getContact();
      return contact.isMe;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  static async isGroupMessage(message) {
    try {
      const chat = await message.getChat();
      return chat.isGroup;
    } catch (error) {
      console.error('Error checking if group message:', error);
      return false;
    }
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static formatPhoneNumber(number) {
    let result = number.replace(/\s/g, "");
    
    // Format Sri Lankan numbers
    if (result[0] === "0") {
      result = "94" + result.slice(1);
    }
    if (result[0] === "7") {
      result = "94" + result;
    }
    
    return `${result}@c.us`;
  }

  static sanitizeInput(input) {
    return input.trim().replace(/[^\w\s]/gi, '');
  }
}

module.exports = MessageUtils;
