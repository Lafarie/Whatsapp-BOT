const WhatsAppBot = require('./src/bot');

// Create and start the bot
const bot = new WhatsAppBot();
bot.start().catch(console.error);


