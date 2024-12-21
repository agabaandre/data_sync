const puppeteer = require('puppeteer');
const { puppeteerConfig } = require('./config');
const { downloadFiles, getSessionCookie } = require('./utils');
const cron = require('node-cron');
const express = require('express');
const app = express();

async function syncProcess() {
  console.log('Launching Puppeteer browser');
  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();

  console.log('Setting user agent and navigating to login page');
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'
  );
  await page.goto('https://ems.africacdc.org', { waitUntil: 'networkidle2' });

  const { J_USERNAME: username, J_PASSWORD: password } = process.env;
  if (!username || !password) {
    console.error('Missing credentials');
    return;
  }

  console.log('Entering login credentials');
  await page.type('#j_username', username);
  await page.type('#j_password', password);
  await page.click('input[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  console.log('Fetching session cookie');
  const sessionCookie = await getSessionCookie(page, 'JSESSIONID');
  const downloadLinks = require('./downloadLinks');

  console.log('Starting file download process');
  await downloadFiles(downloadLinks['mpox'], sessionCookie);


  console.log('Closing Puppeteer browser');
  await browser.close();
}

cron.schedule('0 0 * * 0', async () => {
  console.log('Starting scheduled sync process');
  try {
    await syncProcess();
    console.log('Scheduled sync process completed successfully');
  } catch (error) {
    console.error('Error during scheduled sync process:', error);
  }
});

console.log('Cron job scheduled to run every Sunday at midnight.');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use('/api', require('./routes'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

if (process.argv.includes('--force')) {
  console.log('Force execution triggered');
  syncProcess()
    .then(() => console.log('Force execution completed successfully'))
    .catch(error => console.error('Error during force execution:', error));
}