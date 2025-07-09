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
      const jokeMsg = await message.reply(joke.setup || joke.joke);
      
      if (joke.delivery) {
        setTimeout(() => {
          jokeMsg.reply(joke.delivery);
        }, config.behavior.timeouts.jokeDelivery);
      }
    } catch (error) {
      message.reply(error.message);
    }
  }
}

module.exports = new JokeService();
