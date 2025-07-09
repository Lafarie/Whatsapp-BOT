# WhatsApp Bot - Secure & Optimized with pnpm + Baileys

A modern, secure WhatsApp bot built with Node.js, using Baileys and pnpm for optimal performance and security.

## 🚀 Features

- **Group Management**: Add participants to WhatsApp groups from Google Sheets
- **Joke Service**: Get random jokes from external API  
- **Admin Commands**: Special commands for bot administrators
- **Modular Architecture**: Well-organized code structure for easy maintenance
- **Environment Configuration**: Secure configuration management
- **Zero Vulnerabilities**: No security vulnerabilities (verified with pnpm audit)
- **Fast Package Management**: Uses pnpm for faster installs and better disk usage

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
│   │   └── messageHandler.js  # Message routing
│   ├── services/
│   │   ├── jokeService.js     # Joke API integration
│   │   ├── sheetDBService.js  # Google Sheets integration
│   │   └── groupService.js    # Group management logic
│   ├── utils/
│   │   └── messageUtils.js    # Utility functions
│   └── bot.js                 # Main bot class
├── index.js                   # Entry point
├── .env.template              # Environment variables template
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
   cp .env.template .env
   ```

4. **Configure your environment variables in `.env`**

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
- `!admin` - Admin-only commands

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
