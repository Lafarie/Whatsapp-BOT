require('dotenv').config();

module.exports = {
  BOT_NUMBER: process.env.BOT_NUMBER || "94776350933@c.us",
  SHEETDB_API_URL: process.env.SHEETDB_API_URL || "https://sheetdb.io/api/v1/n5of53ejptco6",
  BACKUP_SHEETDB_URL: process.env.BACKUP_SHEETDB_URL || "https://sheetdb.io/api/v1/bwzepplqnn59m",
  JOKE_API_URL: "https://v2.jokeapi.dev/joke/Miscellaneous,Pun,Spooky?safe-mode",
  COMMANDS: {
    HELP: ['help', '!help'],
    JOKE: ['!joke', 'joke'],
    ADD: ['!add', 'add'],
    ADMIN: ['!admin']
  },
  GREETINGS: ["hi", "hii", "hiii", "hey", "hello", "whatsup", "ado"],
  BAD_WORDS: ["hutto", "pakko", "kariyo", "hutti", "fuck"],
  MESSAGES: {
    GREETING_REPLY: "HI, I'm Farhad's Chat bot. If you need more help type help",
    HELP_MENU: `Commands\n1. !joke - Get joke comment\n2. !add - add users to group\n3. Coming soon.`,
    NOT_ADMIN: "I'm not admin in this group. Make sure to give me admin to add participants.",
    GROUP_NOT_FOUND: "Group not found. Make sure to add me to that group and check the spellings",
    ADMIN_ONLY: "Nice try! You almost got me haha, you're not admin."
  }
};
