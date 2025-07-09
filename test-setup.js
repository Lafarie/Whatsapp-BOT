#!/usr/bin/env node

// Test script to verify AI integration setup
console.log('🧪 Testing WhatsApp Bot AI Integration...\n');

try {
  // Test configuration loading
  console.log('1. Testing configuration...');
  const config = require('./src/config/config');
  console.log('   ✅ Config loaded successfully');
  console.log(`   📋 AI enabled: ${config.ai?.enabled}`);
  console.log(`   🤖 AI model: ${config.ai?.model}`);
  console.log(`   🔑 API key configured: ${config.ai?.openaiApiKey ? 'Yes' : 'No'}`);

  // Test AI service loading
  console.log('\n2. Testing AI service...');
  const aiService = require('./src/services/aiService');
  console.log('   ✅ AI service loaded successfully');

  // Test message handler loading
  console.log('\n3. Testing message handler...');
  const MessageHandler = require('./src/handlers/messageHandler');
  console.log('   ✅ Message handler loaded successfully');

  // Test command handler loading
  console.log('\n4. Testing command handler...');
  const CommandHandler = require('./src/handlers/commandHandler');
  console.log('   ✅ Command handler loaded successfully');

  console.log('\n🎉 All components loaded successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Set your OPENAI_API_KEY in .env file');
  console.log('   2. Run: pnpm start');
  console.log('   3. Scan QR code to connect');
  console.log('   4. Start chatting!');

} catch (error) {
  console.error('❌ Error during testing:', error.message);
  console.error('\n🔧 Common fixes:');
  console.error('   1. Make sure all dependencies are installed: pnpm install');
  console.error('   2. Check your .env file configuration');
  console.error('   3. Ensure OpenAI API key is set');
  process.exit(1);
}
