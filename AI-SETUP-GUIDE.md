# 🤖 AI Chat Integration Setup Guide

Your WhatsApp bot is now integrated with ChatGPT to respond as if it's you (Farhad) talking! Here's how to set it up and use it.

## 🚀 Quick Setup

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Configure Environment
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Optionally adjust AI settings:
   ```bash
   OPENAI_MODEL=gpt-3.5-turbo          # or gpt-4
   OPENAI_MAX_TOKENS=150               # Response length
   OPENAI_TEMPERATURE=0.8              # Creativity (0-1)
   AI_ENABLED=true                     # Enable/disable AI
   ```

### 3. Install Dependencies & Start
```bash
pnpm install
pnpm start
```

## 🎯 How It Works

### Private Chats
- **Automatic Response**: Bot responds to most messages as if you're personally replying
- **Conversation Memory**: Remembers context from previous messages
- **Smart Filtering**: Ignores commands, very short messages, and bot interactions
- **Personal Style**: Responds as Farhad, not as an AI assistant

### Group Chats  
- **Mention Detection**: Responds when someone mentions "farhad", "bot", or uses @mentions
- **Natural Flow**: Won't interrupt normal group conversations
- **Contextual**: Understands group dynamics and responds appropriately

### Commands Still Work
- All existing commands (`!joke`, `!help`, `!add`, etc.) work as before
- New command: `!clearai` - clears conversation history for fresh start
- AI responses only trigger for non-command messages

## 🎨 Personality Features

The AI is programmed to respond as Farhad with these characteristics:

### Speaking Style
- ✅ Casual, friendly tone
- ✅ Tech-enthusiastic when relevant
- ✅ Uses "I", "me", "my" naturally
- ✅ WhatsApp-style language with appropriate emojis
- ✅ Local expressions and slang

### Knowledge Areas
- 🔧 Programming and web development  
- 🤖 WhatsApp bots and automation
- 💻 Technology and new tools
- 🧩 Problem-solving and coding challenges
- 🤝 Helping others with tech stuff

### Behavioral Rules
- ❌ Never mentions being an AI
- ❌ Doesn't start with "As an AI assistant"
- ❌ Avoids overly formal language
- ❌ Won't give long explanations unless asked
- ✅ Keeps responses conversational (1-3 sentences usually)
- ✅ Shows genuine interest in conversations

## 🛠️ Customization

### Adjust Personality
Edit `src/services/aiService.js` → `getPersonalityPrompt()` method to customize:
- Speaking style and tone
- Areas of expertise  
- Behavioral rules
- Local expressions

### Modify Response Logic
Edit `src/services/aiService.js` → `shouldRespondWithAI()` method to change:
- When to respond in groups
- What messages to ignore
- Response filtering rules

### Change AI Settings
Edit `.env` file to adjust:
- `OPENAI_MODEL`: gpt-3.5-turbo (cheaper) or gpt-4 (smarter)
- `OPENAI_MAX_TOKENS`: Response length (50-300 recommended)
- `OPENAI_TEMPERATURE`: Creativity level (0.6-1.0 recommended)

## 🔍 Monitoring & Debugging

### Check AI Status
```bash
node test-setup.js
```

### Monitor Conversations
- AI responses are logged with 🤖 emoji
- Conversation stats available in service
- Error messages show in console

### Disable AI Temporarily
Set in `.env`:
```bash
AI_ENABLED=false
```

## 💡 Usage Examples

### Private Chat Examples
```
User: "Hey, how are you?"
Bot: "Hey! I'm doing great, just working on some coding projects. How about you?"

User: "What did you do today?"  
Bot: "Spent most of the day debugging this WhatsApp bot actually! 😅 Finally got the AI integration working smoothly. What about your day?"
```

### Group Chat Examples
```
User: "Does anyone know about JavaScript?"
(No response - normal group conversation)

User: "Hey Farhad, can you help with this code?"
Bot: "Sure! What's the issue you're running into? Happy to help debug it"

User: "The bot isn't working"
Bot: "Oh no! What's it doing? I can take a look and fix it"
```

## 🚨 Important Notes

1. **API Costs**: OpenAI charges per token used. Monitor usage at [OpenAI Usage](https://platform.openai.com/usage)

2. **Rate Limits**: Free tier has rate limits. Consider upgrading for heavy usage.

3. **Privacy**: Conversations are sent to OpenAI for processing. Don't share sensitive info.

4. **Backup Responses**: If AI fails, bot sends friendly fallback messages.

5. **Memory**: Conversation history is stored in memory and resets when bot restarts.

## 🎉 You're Ready!

Your bot now chats like you! Start a conversation and watch it respond as Farhad. Use `!clearai` anytime to reset conversation history and start fresh.

Enjoy your AI-powered WhatsApp experience! 🚀
