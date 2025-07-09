const axios = require('axios');
const config = require('./config');

class SheetDBService {
  constructor() {
    this.baseURL = config.SHEETDB_API_URL;
    this.backupURL = config.BACKUP_SHEETDB_URL;
  }

  async fetchNumbers() {
    try {
      const response = await axios.get(this.baseURL);
      const data = response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from SheetDB');
      }

      const numbers = data.map(item => {
        if (!item.Number) {
          console.warn('Item missing Number field:', item);
          return null;
        }
        return this.formatPhoneNumber(item.Number);
      }).filter(Boolean); // Remove null values

      return numbers;
    } catch (error) {
      console.error('Error fetching numbers from SheetDB:', error);
      throw new Error('Failed to fetch numbers from database');
    }
  }

  formatPhoneNumber(number) {
    if (!number) return null;
    
    // Remove all spaces
    let cleaned = number.replace(/\s/g, '');
    
    // Add country code if missing
    if (cleaned.startsWith('0')) {
      cleaned = '94' + cleaned.slice(1);
    } else if (cleaned.startsWith('7')) {
      cleaned = '94' + cleaned;
    }
    
    // Validate phone number format (basic validation)
    if (!/^\d{11,}$/.test(cleaned)) {
      console.warn('Invalid phone number format:', number);
      return null;
    }
    
    return `${cleaned}@c.us`;
  }

  async backupData() {
    try {
      const data = await this.fetchNumbers();
      
      const modifiedData = data.map((number, index) => ({
        Id: index + 1,
        Date: new Date().toISOString(),
        Number: number.replace('@c.us', ''),
        Status: 'processed'
      }));

      const response = await axios.post(this.backupURL, {
        data: modifiedData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Data backed up successfully');
      return response.data;
    } catch (error) {
      console.error('Error backing up data:', error);
      throw new Error('Failed to backup data');
    }
  }

  async clearData() {
    try {
      const response = await axios.delete(`${this.baseURL}/all`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Data cleared successfully');
      return response.data;
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }

  async processAndCleanup() {
    try {
      const numbers = await this.fetchNumbers();
      await this.backupData();
      await this.clearData();
      return numbers;
    } catch (error) {
      console.error('Error in process and cleanup:', error);
      throw error;
    }
  }
}

module.exports = SheetDBService;
