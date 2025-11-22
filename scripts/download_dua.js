const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://raw.githubusercontent.com/fitrahive/dua-dhikr/main/data/dua-dhikr';
const TARGET_DIR = path.join(__dirname, '../assets/dua');

const CATEGORIES = [
  'morning-dhikr',
  'evening-dhikr',
  'selected-dua'
];

const LANGUAGES = ['en', 'id'];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const main = async () => {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  for (const category of CATEGORIES) {
    const categoryDir = path.join(TARGET_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    for (const lang of LANGUAGES) {
      const url = `${BASE_URL}/${category}/${lang}.json`;
      const dest = path.join(categoryDir, `${lang}.json`);
      console.log(`Downloading ${url} to ${dest}...`);
      try {
        await downloadFile(url, dest);
        console.log(`Downloaded ${category}/${lang}.json`);
      } catch (error) {
        console.error(`Error downloading ${category}/${lang}.json:`, error.message);
      }
    }
  }
};

main();
