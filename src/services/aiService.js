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
        .reduce((total, history) => total + history.length, 0)
    };
  }
}

module.exports = new AIService();
