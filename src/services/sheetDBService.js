const config = require('../config/config');

class SheetDBService {
  async fetchNumbers() {
    try {
      const response = await fetch(config.api.sheetDb.sourceUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.includes && data.includes("404")) {
        throw new Error("Sheet not found");
      }
      
      return this.processNumbers(data);
    } catch (error) {
      console.error('Error fetching numbers:', error);
      throw new Error('Error getting data, try again in a few moments');
    }
  }

  processNumbers(data) {
    const numbers = [];
    
    data.forEach((item) => {
      let tempNum = item.Number;
      if (!tempNum) return;
      
      let result = tempNum.replace(/\s/g, "");
      
      // Format Sri Lankan numbers
      if (result[0] === "0") {
        result = "94" + result.slice(1);
      }
      if (result[0] === "7") {
        result = "94" + result;
      }
      
      numbers.push(`${result}@c.us`);
    });
    
    return numbers;
  }

  async backupData() {
    try {
      const sourceResponse = await fetch(config.api.sheetDb.sourceUrl);
      const data = await sourceResponse.json();
      
      const modifiedData = data.map((entry) => ({
        Id: "INCREMENT",
        Date: new Date().toISOString(),
        Name: entry.Name || "No name",
        Number: entry.Number,
      }));

      const backupResponse = await fetch(config.api.sheetDb.backupUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: modifiedData }),
      });

      if (!backupResponse.ok) {
        throw new Error(`Backup failed: ${backupResponse.status}`);
      }

      console.log("Data backed up successfully");
      return await backupResponse.json();
    } catch (error) {
      console.error("Error backing up data:", error);
      throw error;
    }
  }

  async clearSourceData() {
    try {
      const response = await fetch(`${config.api.sheetDb.sourceUrl}/all`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      console.log("Source data cleared successfully");
      return await response.json();
    } catch (error) {
      console.error("Error clearing source data:", error);
      throw error;
    }
  }
}

module.exports = new SheetDBService();
