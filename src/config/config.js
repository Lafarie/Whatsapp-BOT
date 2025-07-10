require('dotenv').config();

module.exports = {
  // Bot Configuration
  bot: {
    myNumber: process.env.BOT_NUMBER || "94776350933@c.us",
    adminNumber: process.env.ADMIN_NUMBER || "94776350933@c.us"
  },

  // API Configuration
  api: {
    jokeApi: "https://v2.jokeapi.dev/joke/Miscellaneous,Pun,Spooky?safe-mode",
    sheetDb: {
      sourceUrl: process.env.SHEETDB_SOURCE_URL || "https://sheetdb.io/api/v1/n5of53ejptco6",
      backupUrl: process.env.SHEETDB_BACKUP_URL || "https://sheetdb.io/api/v1/bwzepplqnn59m",
      googleSheetUrl: process.env.GOOGLE_SHEET_URL || "https://docs.google.com/spreadsheets/d/1uppXgyuMYAtA7QgzDhWkEmHdN7yvuG1QhJoRCs3db1s/edit?usp=sharing"
    }
  },

  // Bot Behavior Configuration
  behavior: {
    greetings: ["hi", "hii", "hiii", "hey", "hello", "whatsup", "ado"],
    badWords: ["hutto", "pakko", "kariyo", "hutti", "fuck"],
    timeouts: {
      jokeDelivery: 5000,
      dataProcessing: 5000,
      statusReport: 15000
    },
    ai: {
      batchDelay: 15000, // 15 seconds to collect messages
      cooldownDelay: 10000 // 10 seconds cooldown after response
    }
  },

  // AI Configuration
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 150,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.8,
    enabled: process.env.AI_ENABLED !== 'false' // Default to true unless explicitly disabled
  },

  // Command Configuration
  commands: {
    help: ["help", "!help"],
    joke: ["!joke", "joke"],
    add: ["!add", "add"],
    admin: ["!admin"],
    ping: ["!ping", "ping"],
    pong: ["!pong", "pong"],
    clearai: ["!clearai", "clear ai"],
    stats: ["!stats", "stats"]
  }
};
