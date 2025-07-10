// Test script to demonstrate the message batching functionality
const aiService = require('./src/services/aiService');

console.log('🧪 Testing Message Batching System\n');

// Mock reply function
const mockReply = (userNumber, response) => {
  console.log(`✅ Reply sent to ${userNumber}: "${response}"\n`);
};

// Simulate user sending multiple messages
const testUser = '94716039892';
const userName = 'Test User';

console.log('📦 Simulating user sending multiple messages quickly...\n');

// Add first message
aiService.addMessageToBatch(
  'Hey what is the status of the production server?',
  testUser,
  userName,
  (response) => mockReply(testUser, response)
);

// Add second message after 2 seconds
setTimeout(() => {
  aiService.addMessageToBatch(
    'Also can you check the database?',
    testUser,
    userName,
    (response) => mockReply(testUser, response)
  );
}, 2000);

// Add third message after 5 seconds
setTimeout(() => {
  aiService.addMessageToBatch(
    'And the API endpoints too',
    testUser,
    userName,
    (response) => mockReply(testUser, response)
  );
}, 5000);

// Try to send another message after 20 seconds (should be in cooldown)
setTimeout(() => {
  console.log('⏰ Trying to send message during cooldown period...\n');
  aiService.addMessageToBatch(
    'Hello again!',
    testUser,
    userName,
    (response) => mockReply(testUser, response)
  );
}, 20000);

// Try to send message after 30 seconds (cooldown should be over)
setTimeout(() => {
  console.log('✅ Cooldown should be over, sending new message...\n');
  aiService.addMessageToBatch(
    'This should work now',
    testUser,
    userName,
    (response) => mockReply(testUser, response)
  );
}, 30000);

// Show stats every 5 seconds
const statsInterval = setInterval(() => {
  const stats = aiService.getStats();
  console.log(`📊 Stats: Batches: ${stats.pendingBatches}, Cooldowns: ${stats.activeCooldowns}`);
}, 5000);

// Stop after 45 seconds
setTimeout(() => {
  clearInterval(statsInterval);
  console.log('\n🏁 Test completed!');
  process.exit(0);
}, 45000);
