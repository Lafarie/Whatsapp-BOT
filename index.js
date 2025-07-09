// const WhatsAppBot = require('./src/bot');
import WhatsAppBot from './src/bot';

// Create and start the bot
const bot = new WhatsAppBot();
bot.start().catch(console.error);


