# WhatsApp Bot - Secure & Optimized with pnpm + Baileys

A modern, secure WhatsApp bot built with Node.js, using Baileys and pnpm for optimal performance and security.

## 🚀 Features

- **🤖 AI Chat Integration**: Powered by OpenAI ChatGPT - responds as if you're chatting directly with Farhad
- **Group Management**: Add participants to WhatsApp groups from Google Sheets
- **Joke Service**: Get random jokes from external API  
- **Admin Commands**: Special commands for bot administrators
- **Modular Architecture**: Well-organized code structure for easy maintenance
- **Environment Configuration**: Secure configuration management
- **Zero Vulnerabilities**: No security vulnerabilities (verified with pnpm audit)
- **Fast Package Management**: Uses pnpm for faster installs and better disk usage

## 🤖 AI Features

- **Personal Conversation Style**: The bot responds as if you're chatting directly with Farhad, not an AI
- **Context Awareness**: Remembers conversation history for natural, flowing conversations
- **Smart Filtering**: Only responds to appropriate messages (not commands or bot interactions)
- **Group Intelligence**: In groups, responds when mentioned or when specific keywords are used
- **Conversation Management**: Use `!clearai` to reset conversation history
- **Fallback Handling**: Graceful error handling with friendly fallback messages

## 🔒 Security Improvements

✅ **No vulnerabilities** (previously had 5 high severity issues)  
✅ **Baileys instead of whatsapp-web.js** (no Puppeteer dependencies)  
✅ **Latest axios version** (1.10.0 with security fixes)  
✅ **pnpm package manager** (better dependency resolution)
- **Environment Configuration**: Secure configuration management
- **Error Handling**: Comprehensive error handling and logging

## Project Structure

```
├── src/
│   ├── config/
│   │   └── config.js          # Configuration management
│   ├── handlers/
│   │   ├── commandHandler.js  # Command processing
│   │   ├── groupHandler.js    # Group operations
│   │   └── messageHandler.js  # Message routing & AI integration
│   ├── services/
│   │   ├── aiService.js       # OpenAI ChatGPT integration
│   │   ├── jokeService.js     # Joke API integration
│   │   ├── sheetDBService.js  # Google Sheets integration
│   │   └── groupService.js    # Group management logic
│   ├── utils/
│   │   └── messageUtils.js    # Utility functions
│   └── bot.js                 # Main bot class
├── index.js                   # Entry point
├── .env.example               # Environment variables template
└── package.json               # Dependencies and scripts
```

## Installation

1. **Install pnpm** (if not already installed):
   ```bash
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   # or
   npm install -g pnpm
   ```

2. **Clone the repository and install dependencies**:
   ```bash
   pnpm install
   ```

3. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your environment variables in `.env`**:
   - Set your WhatsApp bot number and admin number
   - Add your OpenAI API key for AI features
   - Configure SheetDB URLs for group management
   - Adjust AI settings (model, temperature, etc.)

5. **Get OpenAI API Key**:
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Create an API key
   - Add it to your `.env` file as `OPENAI_API_KEY`

## Usage

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm start
```

### Other Commands
```bash
# Clean install (removes everything and reinstalls)
pnpm run fresh-install

# Security audit
pnpm audit

# Clean temporary files
pnpm run clean
```

## Commands

- `help` or `!help` - Show available commands
- `!joke` or `joke` - Get a random joke
- `!add` - Instructions for adding users to groups
- `!add [Group Name]` - Add users from sheet to specified group
- `!clearai` - Clear conversation history with AI
- `!admin` - Admin-only commands

## 🤖 AI Chat Behavior

**Private Chats:**
- Responds to most messages automatically as Farhad
- Maintains conversation context
- Ignores commands and very short messages

**Group Chats:**
- Only responds when "farhad", "bot", or mentions are detected
- Helps maintain natural group conversation flow
- Can be directly addressed for responses

**Personality:**
- Responds as Farhad Lafarie, not as an AI
- Casual, friendly, tech-enthusiastic tone
- Shows expertise in programming and bot development
- Uses natural WhatsApp-style language

## Key Improvements

### 1. **Modular Architecture**
- Separated concerns into different modules
- Services for external API integrations
- Handlers for different message types
- Utilities for common functions

### 2. **Configuration Management**
- Environment-based configuration
- Centralized settings
- Secure credential handling

### 3. **Error Handling**
- Try-catch blocks throughout
- Graceful error messages
- Proper logging

### 4. **Performance Optimizations**
- Single event listener setup
- Async/await for better flow control
- Reduced timeout dependencies
- Memory-efficient processing

### 5. **Code Quality**
- Consistent naming conventions
- Proper class structure
- Reusable components
- Clean separation of concerns

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BOT_NUMBER` | Bot's WhatsApp number | `947761234567@c.us` |
| `ADMIN_NUMBER` | Admin's WhatsApp number | `947761234567@c.us` |
| `SHEETDB_SOURCE_URL` | Source sheet API URL | `https://sheetdb.io/api/v1/...` |
| `SHEETDB_BACKUP_URL` | Backup sheet API URL | `https://sheetdb.io/api/v1/...` |
| `GOOGLE_SHEET_URL` | Google Sheet for user input | `https://docs.google.com/...` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License
