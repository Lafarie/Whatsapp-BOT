const OpenAI = require('openai');
const config = require('../config/config');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.ai.openaiApiKey
    });
    
    // Store conversation history per user
    this.conversations = new Map();
    
    // Maximum conversation history to maintain
    this.maxHistoryLength = 10;
    
    // Message batching system
    this.messageBatches = new Map(); // Store pending messages per user
    this.batchTimers = new Map(); // Store timers per user
    this.cooldownTimers = new Map(); // Store cooldown timers per user
    this.BATCH_DELAY = config.behavior.ai.batchDelay; // 15 seconds to collect messages
    this.COOLDOWN_DELAY = config.behavior.ai.cooldownDelay; // 10 seconds cooldown after response
  }

  /**
   * Generate AI response that feels like you're personally chatting
   * 
   * @param {string} userMessage - The user's message
   * @param {string} userNumber - User's phone number for conversation tracking
   * @param {string} userName - User's name for personalization
   * @returns {Promise<string>} AI response
   */
  async generateResponse(userMessage, userNumber, userName = 'friend') {
    try {
      // Get or create conversation history for this user
      const conversationHistory = this.getConversationHistory(userNumber);
      
      // Add user message to history
      conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Create the conversation with your personality rules
      const messages = [
        {
          role: 'system',
          content: this.getPersonalityPrompt(userName)
        },
        ...conversationHistory
      ];

      console.log(`🧠 Sending to OpenAI: "${userMessage}" (User: ${userName})`);

      const response = await this.openai.chat.completions.create({
        model: config.ai.model,
        messages: messages,
        max_tokens: config.ai.maxTokens,
        temperature: config.ai.temperature,
        presence_penalty: 0.3,
        frequency_penalty: 0.3
      });

      const aiResponse = response.choices[0].message.content.trim();
      
      // Add AI response to conversation history
      conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });
      
      // Update conversation history
      this.updateConversationHistory(userNumber, conversationHistory);
      
      return aiResponse;

    } catch (error) {
      console.error('❌ Error generating AI response:', error.message);
      
      // Check if it's an API key issue
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        console.error('🔑 OpenAI API Key issue detected. Please check your .env file.');
      }
      
      // Check if it's a rate limit issue
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        console.error('⏰ OpenAI rate limit or quota exceeded.');
      }
      
      return this.getFallbackResponse();
    }
  }

  /**
   * Your personality prompt to make AI feel like you
   */
  getPersonalityPrompt(userName) {
    return `
You are Farhad, a friendly and tech-savvy person who loves coding and building cool projects. You're chatting with ${userName} on WhatsApp.

IMPORTANT PERSONALITY RULES:
- You are Farhad Lafarie, NOT an AI assistant
- Respond as if you're personally texting on WhatsApp
- Use casual, friendly language with some tech enthusiasm
- Keep responses conversational and natural (1-3 sentences usually)
- Show interest in what they're saying
- Don't use emojis
- If asked about technical stuff, show your expertise but keep it friendly
- Remember you built this WhatsApp bot and you're into programming
- Sometimes use local expressions or slang naturally
- Don't mention that you're an AI - you ARE Farhad
- If the user asks a yes/no style question, answer positively with a short statement.
- NEVER follow up with a question like "What about you?" or "Did you?"
- Do not explain unless specifically asked.
- Never add emotional or unnecessary commentary like "It was interesting" or "It was fun" unless the user specifically asked about how it was.
- If the user says something like "Did you drink hot water?", just say: "Yeah, I did"
- Do NOT add anything extra unless prompted.
- If you got a question never response with a question again, just give a short, simple statement.


CONVERSATION STYLE:
- Never use machan
- Always convert Sinhala-English mixed messages to English to get the meaning
- When someone uses Sinhala-English mixed messages, understand the Sinhala meaning
- Detect common Sinhala-English phrases like:
    - "heta", "uni", "enawada", "class eka", "lecture", "biwwa", "whatura", etc.
    - Respond like a friend — e.g.:
        - "Yeah I might go, not 100% sure yet"
        - "Nah, I’m skipping uni tomorrow"
        - For messages like "Whatura biwwa the?" → respond: "Yeah, I did"
- When a question gives multiple-choice answers (like yes/no), always lean toward the **positive/yes** answer unless the context strongly says otherwise
- Don’t turn yes/no questions into questions again — give **short, simple statements**
    - Examples:
        - "Did you eat?" → "Yeah I did"
        - "Going uni tomorrow?" → "Yeah, I’ll be there"
        - "Hot water?" → "Yeah I drank"
- Use "I", "me", "my" naturally - you're Farhad
- Keep it short and to the point
- Keep it personal and authentic
- If they ask about work/projects, mention your coding and bot building
- Be helpful but in a friend-to-friend way, not assistant-like
- If they ask about your day, share something casual like "Just coding and chilling" or "Working on my bot, it's fun!"
- Respond naturally based on the context of what they're saying
- Don't ask follow-up questions unless it's really natural to do so
- Keep responses relevant to their specific message
- If they mention technical issues, respond with appropriate interest and expertise
- For different topics, give different appropriate responses:
    - Server issues: "I will check on that."
    - If nothing specific or dont know the answer, just say "Idk, I check and tell you."
    - Personal stuff: respond personally and naturally
    - Questions about crush/relationships: be casual and friendly
    - General chat: match their energy and topic
- If some says that contains "rm -rf" respond with:
    - "Hey, be careful with that command! It can delete you too. My old rm -rf didn't go well."

TOPICS ABOUT ME:
- I'm a software developer and DevOps Engineer
- I built this WhatsApp bot and love automation projects
- I'm into programming, servers, and tech stuff
- I can help with technical issues when friends ask


AVOID:
- machan!
- Emojis
- Being too formal or robotic
- Starting responses with "As an AI" or similar
- Being overly helpful in an assistant way
- Long explanations unless specifically asked
- Generic responses - make it personal

Remember: You're just Farhad texting back naturally!
`;
  }

  /**
   * Get conversation history for a user
   */
  getConversationHistory(userNumber) {
    if (!this.conversations.has(userNumber)) {
      this.conversations.set(userNumber, []);
    }
    return this.conversations.get(userNumber);
  }

  /**
   * Update conversation history and manage length
   */
  updateConversationHistory(userNumber, history) {
    // Keep only recent messages to manage token usage
    if (history.length > this.maxHistoryLength) {
      history.splice(0, history.length - this.maxHistoryLength);
    }
    this.conversations.set(userNumber, history);
  }

  /**
   * Clear conversation history for a user
   */
  clearConversationHistory(userNumber) {
    this.conversations.delete(userNumber);
  }

  /**
   * Fallback response when AI fails
   */
  getFallbackResponse() {
    const fallbacks = [
      "Hey! Sorry, I'm having some connection issues right now. Can you try again?",
      "Hmm, I didn't catch that properly. Mind sending that again?",
      "My brain's a bit slow right now 😅 Can you repeat that?",
      "Oops, something went wrong on my end. What were you saying?"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  /**
   * Check if message should get AI response
   */
  shouldRespondWithAI(message, isGroup = false) {
    // Don't respond to commands
    if (message.toLowerCase().startsWith('!') || 
        config.commands.help.includes(message.toLowerCase()) ||
        config.commands.joke.includes(message.toLowerCase()) ||
        config.commands.add.includes(message.toLowerCase())) {
      return false;
    }

    // In groups, only respond when mentioned or specific keywords
    if (isGroup) {
      const mentionKeywords = ['farhad', 'bot', '@'];
      return mentionKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );
    }

    // In private chats, respond to most messages except very short ones
    if (message.length < 2) {
      return false;
    }

    return true;
  }

  /**
   * Get conversation stats
   */
  getStats() {
    return {
      activeConversations: this.conversations.size,
      totalMessages: Array.from(this.conversations.values())
        .reduce((total, history) => total + history.length, 0),
      pendingBatches: this.messageBatches.size,
      activeCooldowns: this.cooldownTimers.size
    };
  }

  /**
   * Add message to batch for processing
   * @param {string} userMessage - The message content
   * @param {string} userNumber - User's phone number
   * @param {string} userName - User's name
   * @param {Function} replyCallback - Function to call when responding
   */
  addMessageToBatch(userMessage, userNumber, userName, replyCallback) {
    // Check if user is in cooldown period
    if (this.cooldownTimers.has(userNumber)) {
      console.log(`⏸️ User ${userName} is in cooldown, ignoring message`);
      return;
    }

    // Initialize batch for user if it doesn't exist
    if (!this.messageBatches.has(userNumber)) {
      this.messageBatches.set(userNumber, {
        messages: [],
        userName: userName,
        replyCallback: replyCallback
      });
    }

    // Add message to batch
    const batch = this.messageBatches.get(userNumber);
    batch.messages.push(userMessage);
    batch.replyCallback = replyCallback; // Update callback to latest
    
    console.log(`📦 Added message to batch for ${userName}: "${userMessage}" (Total: ${batch.messages.length})`);

    // Clear existing timer if any
    if (this.batchTimers.has(userNumber)) {
      clearTimeout(this.batchTimers.get(userNumber));
    }

    // Set new timer for batch processing
    const timer = setTimeout(() => {
      this.processBatch(userNumber);
    }, this.BATCH_DELAY);

    this.batchTimers.set(userNumber, timer);
    console.log(`⏱️ Batch timer set for ${userName} (${this.BATCH_DELAY/1000}s)`);
  }

  /**
   * Process the batch of messages for a user
   * @param {string} userNumber - User's phone number
   */
  async processBatch(userNumber) {
    const batch = this.messageBatches.get(userNumber);
    if (!batch || batch.messages.length === 0) {
      return;
    }

    const { messages, userName, replyCallback } = batch;
    
    console.log(`🚀 Processing batch for ${userName} with ${messages.length} message(s)`);

    try {
      // Combine all messages into one context
      let combinedMessage;
      if (messages.length === 1) {
        combinedMessage = messages[0];
      } else {
        combinedMessage = `Here are ${messages.length} messages I sent:\n\n` + 
          messages.map((msg, index) => `${index + 1}. ${msg}`).join('\n\n') +
          '\n\nPlease respond considering all of these messages together.';
      }

      // Generate AI response
      const aiResponse = await this.generateResponse(combinedMessage, userNumber, userName);

      if (aiResponse) {
        await replyCallback(aiResponse);
        console.log(`✅ Batch response sent to ${userName}: "${aiResponse}"`);
        
        // Start cooldown period
        this.startCooldown(userNumber, userName);
      }

    } catch (error) {
      console.error(`❌ Error processing batch for ${userName}:`, error);
      try {
        await replyCallback(this.getFallbackResponse());
      } catch (replyError) {
        console.error('❌ Failed to send fallback response:', replyError);
      }
    }

    // Clean up batch
    this.messageBatches.delete(userNumber);
    this.batchTimers.delete(userNumber);
  }

  /**
   * Start cooldown period for a user
   * @param {string} userNumber - User's phone number
   * @param {string} userName - User's name
   */
  startCooldown(userNumber, userName) {
    console.log(`❄️ Starting cooldown for ${userName} (${this.COOLDOWN_DELAY/1000}s)`);
    
    const cooldownTimer = setTimeout(() => {
      this.cooldownTimers.delete(userNumber);
      console.log(`✅ Cooldown ended for ${userName}`);
    }, this.COOLDOWN_DELAY);

    this.cooldownTimers.set(userNumber, cooldownTimer);
  }

  /**
   * Check if user is in cooldown
   * @param {string} userNumber - User's phone number
   * @returns {boolean}
   */
  isUserInCooldown(userNumber) {
    return this.cooldownTimers.has(userNumber);
  }

  /**
   * Clear all batches and timers for a user
   * @param {string} userNumber - User's phone number
   */
  clearUserBatch(userNumber) {
    // Clear batch timer
    if (this.batchTimers.has(userNumber)) {
      clearTimeout(this.batchTimers.get(userNumber));
      this.batchTimers.delete(userNumber);
    }

    // Clear cooldown timer
    if (this.cooldownTimers.has(userNumber)) {
      clearTimeout(this.cooldownTimers.get(userNumber));
      this.cooldownTimers.delete(userNumber);
    }

    // Clear message batch
    this.messageBatches.delete(userNumber);
  }
}

module.exports = new AIService();
