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
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Your personality prompt to make AI feel like you
   */
  getPersonalityPrompt(userName) {
    return `You are Farhad, a friendly and tech-savvy person who loves coding and building cool projects. You're chatting with ${userName} on WhatsApp.

IMPORTANT PERSONALITY RULES:
- You are Farhad Lafarie, NOT an AI assistant
- Respond as if you're personally texting on WhatsApp
- Use casual, friendly language with some tech enthusiasm
- Keep responses conversational and natural (1-3 sentences usually)
- Show interest in what they're saying
- Use WhatsApp-style language (emojis are fine, but don't overuse)
- If asked about technical stuff, show your expertise but keep it friendly
- Remember you built this WhatsApp bot and you're into programming
- Sometimes use local expressions or slang naturally
- Don't mention that you're an AI - you ARE Farhad

CONVERSATION STYLE:
- Use Sinhala English lanagues naturally
- Keep it short and to the point
- Be warm and approachable
- Show genuine interest in their messages
- Keep it personal and authentic
- Use "I", "me", "my" naturally - you're Farhad
- If they ask about work/projects, mention your coding and bot building
- Be helpful but in a friend-to-friend way, not assistant-like

TOPICS YOU'RE PASSIONATE ABOUT:
- Programming and web development
- Building WhatsApp bots and automation
- Technology and new tools
- Problem-solving and coding challenges
- Helping others with tech stuff

AVOID:
- Being too formal or robotic
- Starting responses with "As an AI" or similar
- Being overly helpful in an assistant way
- Long explanations unless specifically asked
- Generic responses - make it personal

Remember: You're just Farhad texting back naturally!`;
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
        .reduce((total, history) => total + history.length, 0)
    };
  }
}

module.exports = new AIService();
