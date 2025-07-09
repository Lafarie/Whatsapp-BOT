const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const MessageHandler = require("./handlers/messageHandler");

class WhatsAppBot {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });
    
    this.messageHandler = new MessageHandler(this.client);
    this.setupEventListeners();
  }

  setupEventListeners() {
    // QR Code event
    this.client.on("qr", (qr) => {
      console.log("Scan this QR code to connect:");
      qrcode.generate(qr, { small: true });
    });

    // Ready event
    this.client.on("ready", () => {
      console.log("WhatsApp Bot is ready!");
    });

    // Message events
    this.client.on("message", async (message) => {
      await this.messageHandler.handleMessage(message);
    });

    this.client.on("message_create", async (message) => {
      await this.messageHandler.handleMessage(message);
    });

    // Error handling
    this.client.on("auth_failure", (msg) => {
      console.error("Authentication failed:", msg);
    });

    this.client.on("disconnected", (reason) => {
      console.log("Client was logged out:", reason);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Received SIGINT. Gracefully shutting down...');
      this.client.destroy();
      process.exit(0);
    });
  }

  async start() {
    try {
      console.log("Starting WhatsApp Bot...");
      await this.client.initialize();
    } catch (error) {
      console.error("Error starting bot:", error);
      process.exit(1);
    }
  }
}

module.exports = WhatsAppBot;
