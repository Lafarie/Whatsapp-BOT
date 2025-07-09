const axios = require('axios');
const config = require('../config/config');

class JokeService {
  async getRandomJoke() {
    try {
      const response = await axios.get(config.api.jokeApi);
      return response.data;
    } catch (error) {
      console.error('Error fetching joke:', error);
      throw new Error('Sorry, I could not fetch a joke at this time.');
    }
  }

  async sendJoke(message) {
    try {
      const joke = await this.getRandomJoke();
      
      // Send the setup/joke first
      await message.reply(joke.setup || joke.joke);
      
      // If there's a punchline, send it after a delay
      if (joke.delivery) {
        setTimeout(async () => {
          try {
            await message.reply(joke.delivery);
          } catch (error) {
            console.error('Error sending joke punchline:', error);
          }
        }, config.behavior.timeouts.jokeDelivery);
      }
    } catch (error) {
      console.error('Error in sendJoke:', error);
      await message.reply(error.message || 'Sorry, I could not fetch a joke at this time.');
    }
  }
}

module.exports = new JokeService();
