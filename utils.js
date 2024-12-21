const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Fetch session cookie by name.
 * @param {object} page - Puppeteer page instance.
 * @param {string} cookieName - Name of the cookie to retrieve.
 * @returns {string} Cookie value.
 */
async function getSessionCookie(page, cookieName) {
  console.log(`Attempting to fetch cookie: ${cookieName}`);
  const cookie = (await page.cookies()).find(c => c.name === cookieName);
  if (!cookie) throw new Error(`Cookie ${cookieName} not found`);
  console.log(`Cookie ${cookieName} fetched successfully`);
  return cookie.value;
}

/**
 * Download files from given links and save locally.
 * @param {Array} links - Array of download links.
 * @param {string} sessionCookie - Cookie for authentication.
 * @returns {Promise<Array>} List of downloaded file paths.
 */
async function downloadFiles(links, sessionCookie) {
  const downloadedFiles = [];

  console.log(`Starting download for ${links.length} files`);

  for (const link of links) {
    const config = {
      method: 'get',
      url: link.link,
      headers: {
        'Cookie': `JSESSIONID=${sessionCookie}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'
      },
      responseType: 'stream'
    };

    try {
      const baseDir = path.join(process.cwd(), 'downloads', 'mpox');

      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
        console.log(`Directory created: ${baseDir}`);
      } else {
        console.log(`Directory already exists: ${baseDir}`);
      }

      console.log(`Downloading file from: ${link.link}`);
      const response = await axios(config);
      const filePath = `./downloads/mpox/${link.filename}`;
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.log(`File saved successfully: ${filePath}`);
      downloadedFiles.push(filePath);
    } catch (err) {
      console.error(`Failed to download ${link.link}:`, err.message);
    }
  }

  console.log(`Downloaded ${downloadedFiles.length}/${links.length} files successfully`);
  return downloadedFiles;
}

module.exports = { getSessionCookie, downloadFiles };
