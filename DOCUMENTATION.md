# WhatsApp Bot - Complete Documentation

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Configuration](#configuration)
5. [Core Components](#core-components)
6. [Services](#services)
7. [Handlers](#handlers)
8. [Utilities](#utilities)
9. [Commands](#commands)
10. [Setup & Deployment](#setup--deployment)
11. [API Reference](#api-reference)
12. [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

This WhatsApp Bot is a modern, modular automation system built with Node.js that provides:

- **Group Management**: Automatically add participants to WhatsApp groups from Google Sheets
- **Entertainment**: Fetch and send random jokes
- **Admin Controls**: Special commands for bot administrators
- **Secure Architecture**: Zero security vulnerabilities with modern dependencies

### Key Technologies
- **@whiskeysockets/baileys**: WhatsApp Web API client
- **pnpm**: Fast, disk space efficient package manager
- **dotenv**: Environment variable management
- **axios**: HTTP client for API requests
- **qrcode-terminal**: QR code display in terminal

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp      │    │   Bot Instance  │    │   External APIs │
│   Messages      │──▶ │   (Baileys)     │──▶ │   (Jokes, etc.) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Message Handler │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌───────────────┐   ┌───────────────┐
            │ Command       │   │ Group         │
            │ Handler       │   │ Handler       │
            └───────────────┘   └───────────────┘
                    │                   │
                    ▼                   ▼
            ┌───────────────┐   ┌───────────────┐
            │ Services      │   │ Services      │
            │ (Joke, etc.)  │   │ (SheetDB)     │
            └───────────────┘   └───────────────┘
```

## 📁 File Structure

```
├── 📄 index.js                 # Main entry point
├── 📄 package.json             # Dependencies and scripts
├── 📄 nodemon.json            # Development server config
├── 📄 .env.template           # Environment variables template
├── 📄 .gitignore              # Git ignore rules
├── 📄 README.md               # Project documentation
└── 📁 src/                    # Source code directory
    ├── 📁 config/
    │   └── 📄 config.js       # Application configuration
    ├── 📁 handlers/
    │   ├── 📄 messageHandler.js   # Message routing & processing
    │   ├── 📄 commandHandler.js   # Command processing
    │   └── 📄 groupHandler.js     # Group management
    ├── 📁 services/
    │   ├── 📄 jokeService.js      # Joke API integration
    │   ├── 📄 sheetDBService.js   # Google Sheets API
    │   └── 📄 groupService.js     # WhatsApp group operations
    ├── 📁 utils/
    │   └── 📄 messageUtils.js     # Utility functions
    └── 📄 bot.js              # Main bot class
```

## ⚙️ Configuration

### Environment Variables (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `BOT_NUMBER` | Bot's WhatsApp number | `947761234567@c.us` |
| `ADMIN_NUMBER` | Admin's WhatsApp number | `947761234567@c.us` |
| `SHEETDB_SOURCE_URL` | Source sheet API URL | `https://sheetdb.io/api/v1/...` |
| `SHEETDB_BACKUP_URL` | Backup sheet API URL | `https://sheetdb.io/api/v1/...` |
| `GOOGLE_SHEET_URL` | Google Sheet for user input | `https://docs.google.com/...` |

### Configuration Object (`src/config/config.js`)

```javascript
module.exports = {
  bot: {
    myNumber: "Bot's WhatsApp number",
    adminNumber: "Admin's WhatsApp number"
  },
  api: {
    jokeApi: "Joke API endpoint",
    sheetDb: {
      sourceUrl: "Primary sheet URL",
      backupUrl: "Backup sheet URL",
      googleSheetUrl: "Public Google Sheet URL"
    }
  },
  behavior: {
    greetings: ["hi", "hello", "hey", ...],
    badWords: ["inappropriate", "words", ...],
    timeouts: {
      jokeDelivery: 5000,
      dataProcessing: 5000,
      statusReport: 15000
    }
  },
  commands: {
    help: ["help", "!help"],
    joke: ["!joke", "joke"],
    add: ["!add", "add"],
    admin: ["!admin"]
  }
}
```

## 🔧 Core Components

### 1. Bot Class (`src/bot.js`)

**Purpose**: Main WhatsApp bot instance using Baileys

**Key Methods**:
- `constructor()`: Initialize bot with logger and handlers
- `setupEventListeners()`: Configure event handlers for connections, messages, QR codes
- `start()`: Initialize WhatsApp connection and authentication

**Event Handling**:
- `connection.update`: Handle connection state changes, QR codes, disconnections
- `messages.upsert`: Process incoming messages
- `creds.update`: Save authentication credentials

### 2. Message Handler (`src/handlers/messageHandler.js`)

**Purpose**: Route and process all incoming messages

**Key Methods**:
- `handleMessage(message)`: Main message processing logic
- `handleBaileysMessage(message)`: Convert Baileys messages to standard format
- `convertBaileysMessage(baileysMessage)`: Transform Baileys message structure
- `extractMessageText(baileysMessage)`: Extract text from various message types
- `logMessage(message)`: Log message details for debugging

**Message Flow**:
1. Receive Baileys message
2. Convert to standard format
3. Route to appropriate handler
4. Log message details

## 🎮 Services

### 1. Joke Service (`src/services/jokeService.js`)

**Purpose**: Fetch and send random jokes from external API

**Methods**:
- `getRandomJoke()`: Fetch joke from API
- `sendJoke(message)`: Send joke to user with delivery timing

**API Integration**: Uses `https://v2.jokeapi.dev/` for joke content

### 2. SheetDB Service (`src/services/sheetDBService.js`)

**Purpose**: Manage Google Sheets integration for phone numbers

**Methods**:
- `fetchNumbers()`: Retrieve phone numbers from sheet
- `processNumbers(data)`: Format phone numbers for WhatsApp
- `backupData()`: Save data to backup sheet
- `clearSourceData()`: Clear source sheet after processing

**Data Flow**:
1. Fetch numbers from Google Sheet
2. Format for Sri Lankan phone numbers
3. Backup original data
4. Clear source for next batch

### 3. Group Service (`src/services/groupService.js`)

**Purpose**: Manage WhatsApp group operations

**Methods**:
- `findGroup(groupName)`: Locate group by name
- `checkBotAdminStatus(group)`: Verify bot has admin rights
- `addParticipantsToGroup(groupName, numbers)`: Add users to group
- `addSingleParticipant(group, number)`: Add individual participant
- `sendStatusReport(message)`: Send operation results

**Statistics Tracking**:
- Success count
- Already existing participants
- Error numbers
- Non-WhatsApp numbers

## 🎯 Handlers

### 1. Command Handler (`src/handlers/commandHandler.js`)

**Purpose**: Process user commands

**Commands**:

#### `handleHelpCommand(message)`
- Shows available commands
- Lists bot capabilities

#### `handleJokeCommand(message)`
- Triggers joke service
- Sends random joke to user

#### `handleAddCommand(message)`
- Provides Google Sheet link
- Explains group addition process

#### `handleAdminCommand(message)`
- Verifies admin status
- Shows admin-only options

#### `handleGreeting(message)`
- Responds to greetings in private chats
- Provides introduction message

#### `handleDeleteRequest(message)`
- Responds to delete-related messages
- Provides contextual responses

### 2. Group Handler (`src/handlers/groupHandler.js`)

**Purpose**: Handle group-specific operations

**Methods**:
- `handleGroupAddCommand(message)`: Process group addition requests
- `processGroupParticipants(message, groupName, numbers)`: Add participants asynchronously
- `isGroupAddCommand(messageBody)`: Identify group addition commands

**Process Flow**:
1. Validate group name
2. Check bot admin status
3. Fetch numbers from sheet
4. Add participants
5. Send status report

## 🛠️ Utilities

### Message Utils (`src/utils/messageUtils.js`)

**Purpose**: Common utility functions for message processing

**Functions**:

#### Command Detection
- `isCommand(message, commands)`: Check if message is a command
- `isGreeting(message)`: Detect greeting messages
- `isBadWord(message)`: Filter inappropriate content

#### Message Processing
- `extractGroupName(messageBody)`: Extract group name from command
- `isValidSheetURL(url)`: Validate SheetDB URLs
- `formatPhoneNumber(number)`: Format phone numbers for WhatsApp

#### Contact & Chat
- `isFromAdmin(message)`: Check if sender is admin
- `isGroupMessage(message)`: Determine if message is from group
- `delay(ms)`: Create delays for async operations
- `sanitizeInput(input)`: Clean user input

## 🤖 Commands

### User Commands

| Command | Description | Usage | Example |
|---------|-------------|-------|---------|
| `help` | Show available commands | `help` or `!help` | User types "help" |
| `joke` | Get random joke | `joke` or `!joke` | User types "joke" |
| `add` | Show group addition instructions | `add` or `!add` | User types "add" |
| `hi/hello` | Greeting response | Any greeting word | User types "hi" |

### Admin Commands

| Command | Description | Access | Usage |
|---------|-------------|--------|-------|
| `!admin` | Admin menu | Bot owner only | `!admin` |
| `!add GroupName` | Add users to group | Bot in group + admin | `!add My Group` |

### Group Addition Process

1. **User sends**: `!add`
2. **Bot responds**: Google Sheet link + instructions
3. **User adds numbers** to Google Sheet
4. **User sends**: `!add GroupName`
5. **Bot processes**:
   - Validates group exists
   - Checks bot admin status
   - Fetches numbers from sheet
   - Adds participants
   - Backs up data
   - Clears sheet
   - Sends status report

## 🚀 Setup & Deployment

### Development Setup

```bash
# Install pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Install dependencies
pnpm install

# Setup environment
cp .env.template .env
# Edit .env with your configuration

# Start development server
pnpm dev
```

### Production Deployment

```bash
# Start production server
pnpm start

# Or with PM2
pm2 start index.js --name "whatsapp-bot"
```

### Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| Development | `pnpm dev` | Start with auto-reload |
| Production | `pnpm start` | Start production server |
| Clean Install | `pnpm run fresh-install` | Remove all dependencies and reinstall |
| Security Audit | `pnpm audit` | Check for vulnerabilities |
| Clean | `pnpm run clean` | Remove temporary files |

## 📡 API Reference

### External APIs Used

#### Joke API
- **URL**: `https://v2.jokeapi.dev/joke/Miscellaneous,Pun,Spooky?safe-mode`
- **Method**: GET
- **Response**: JSON with joke content
- **Rate Limit**: None specified

#### SheetDB API
- **Source URL**: Configured in environment
- **Backup URL**: Configured in environment
- **Methods**: GET (fetch), POST (backup), DELETE (clear)
- **Authentication**: API key in URL

### Internal API

#### Message Object Structure
```javascript
{
  body: "Message text content",
  from: "sender@whatsapp.jid",
  key: { /* Baileys message key */ },
  isGroup: boolean,
  reply: async (text) => { /* Send reply */ },
  getChat: async () => { /* Get chat info */ },
  getContact: async () => { /* Get contact info */ }
}
```

#### Contact Object Structure
```javascript
{
  number: "94771234567",
  name: "Contact Name",
  pushname: "Display Name",
  isMe: false
}
```

#### Chat Object Structure
```javascript
{
  isGroup: boolean,
  name: "Chat/Group Name"
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. QR Code Not Appearing
**Problem**: QR code not displaying in terminal
**Solution**: Check that `qrcode-terminal` is installed and terminal supports UTF-8

#### 2. Authentication Failed
**Problem**: Cannot connect to WhatsApp
**Solution**: Delete `auth_info_baileys` folder and restart

#### 3. Group Not Found
**Problem**: Bot cannot find group
**Solution**: 
- Ensure bot is added to group
- Check group name spelling (case-sensitive)
- Verify group exists

#### 4. Permission Denied
**Problem**: Cannot add participants
**Solution**: Make bot admin in target group

#### 5. Numbers Not Added
**Problem**: Users not added to group
**Solution**:
- Check phone number format
- Verify users have WhatsApp
- Ensure bot has admin rights

### Debug Mode

Enable detailed logging by modifying logger level in `src/bot.js`:

```javascript
this.logger = P({ level: 'debug' }); // Instead of 'silent'
```

### Health Checks

```bash
# Check if bot is running
pnpm start

# Verify dependencies
pnpm audit

# Test imports
node -e "require('./src/bot.js'); console.log('✅ OK');"
```

### Performance Monitoring

The bot tracks:
- Message processing time
- API response times
- Group operation success rates
- Error frequencies

## 📈 Metrics & Analytics

### Tracked Metrics

1. **Messages Processed**: Total messages handled
2. **Commands Executed**: Count by command type
3. **Group Operations**: Success/failure rates
4. **API Calls**: Response times and errors
5. **User Interactions**: Active users and engagement

### Log Levels

- **INFO**: General operations
- **WARN**: Recoverable errors
- **ERROR**: Critical failures
- **DEBUG**: Detailed troubleshooting info

## 🔐 Security Considerations

### Best Practices Implemented

1. **Environment Variables**: Sensitive data in `.env`
2. **Input Validation**: Sanitize user inputs
3. **Rate Limiting**: Prevent abuse (implement if needed)
4. **Error Handling**: Graceful failure management
5. **Audit Compliance**: Zero security vulnerabilities

### Security Checklist

- [ ] `.env` file not committed to git
- [ ] Regular dependency updates
- [ ] Input validation on all user data
- [ ] Proper error handling
- [ ] Authentication token security
- [ ] Admin command access control

## 🤝 Contributing

### Code Style

- Use consistent indentation (2 spaces)
- Add JSDoc comments for functions
- Follow async/await patterns
- Handle errors gracefully
- Write descriptive variable names

### Adding New Commands

1. Add command to `config.js`
2. Create handler in `CommandHandler`
3. Add routing in `MessageHandler`
4. Update help text
5. Add documentation

### Testing

```bash
# Run basic tests
node -e "require('./src/bot.js'); console.log('✅ Imports OK');"

# Test specific services
node -e "require('./src/services/jokeService.js').getRandomJoke().then(console.log);"
```

This documentation provides a comprehensive guide to understanding, using, and maintaining the WhatsApp bot. Each component is designed to be modular and easily extensible for future enhancements.
