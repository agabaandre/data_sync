require('dotenv').config();

module.exports = {
  puppeteerConfig: {
    headless: true,
    defaultViewport: null,
    args: ['--start-maximized']
  },

};