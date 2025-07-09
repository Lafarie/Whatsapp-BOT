const qrcode = require("qrcode-terminal");
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const MessageHandler = require("./handlers/messageHandler");

class WhatsAppBot {
  constructor() {
    this.socket = null;
    this.messageHandler = null;
    this.logger = P({ level: 'silent' }); // Disable logs for cleaner output
  }

  setupEventListeners() {
    // Handle credential updates
    this.socket.ev.on('creds.update', this.saveCreds);

    // Handle connection updates
    this.socket.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
        
        if (shouldReconnect) {
          this.start();
        }
      } else if (connection === 'open') {
        console.log("✅ WhatsApp Bot is ready!");
      }
    });

    // Handle incoming messages
    this.socket.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];
      
      // Only process messages that are not from us and are notifications
      if (!message.key.fromMe && m.type === 'notify') {
        try {
          console.log('📥 Received message:', {
            from: message.key.remoteJid,
            pushName: message.pushName,
            messageType: Object.keys(message.message || {})[0],
            isGroup: message.key.remoteJid.includes('@g.us')
          });
          
          await this.messageHandler.handleBaileysMessage(message);
        } catch (error) {
          console.error('❌ Error processing message:', error);
        }
      }
    });

    // Error handling
    this.socket.ev.on('connection.update', (update) => {
      if (update.qr) {
        console.log("Scan this QR code to connect:");
        qrcode.generate(update.qr, { small: true });
      }
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Received SIGINT. Gracefully shutting down...');
      this.socket?.end();
      process.exit(0);
    });
  }

  async start() {
    try {
      console.log("🚀 Starting WhatsApp Bot...");
      
      // Use multi-file auth state for session persistence
      const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
      this.saveCreds = saveCreds;
      
      this.socket = makeWASocket({
        auth: state,
        logger: this.logger
      });

      this.messageHandler = new MessageHandler(this.socket);
      this.setupEventListeners();
      
    } catch (error) {
      console.error("❌ Error starting bot:", error);
      process.exit(1);
    }
  }
}

module.exports = WhatsAppBot;
