# WhatsApp Bot - Optimized Version

A modern, modular WhatsApp bot built with Node.js for group management and automation.

## Features

- **Group Management**: Add participants to WhatsApp groups from Google Sheets
- **Joke Service**: Get random jokes from external API
- **Admin Commands**: Special commands for bot administrators
- **Modular Architecture**: Well-organized code structure for easy maintenance
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

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template:
   ```bash
   cp .env.template .env
   ```

4. Configure your environment variables in `.env`:
   ```
   BOT_NUMBER=your_bot_number@c.us
   ADMIN_NUMBER=your_admin_number@c.us
   SHEETDB_SOURCE_URL=your_sheetdb_source_url
   SHEETDB_BACKUP_URL=your_sheetdb_backup_url
   GOOGLE_SHEET_URL=your_google_sheet_url
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
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
