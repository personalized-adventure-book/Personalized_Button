const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const SHEET_ID = process.env.GSHEET_SHEET_ID;
const key = JSON.parse(process.env.GSHEET_SERVICE_KEY);

async function main() {
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'FormConfig',
  });

  const rows = res.data.values;
  if (!rows || rows.length < 2) {
    console.error("❌ Sheet has no data");
    return;
  }

  const languages = rows[0].slice(1); // B1, C1, D1...

  // Ensure root 'content' folder exists
  const rootDir = 'content';
  if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);

  for (let i = 1; i < rows.length; i++) {
    const website = rows[i][0];
    const websiteDir = path.join(rootDir, website);

    // Create folder for the website if not exists
    if (!fs.existsSync(websiteDir)) fs.mkdirSync(websiteDir);

    for (let j = 1; j < rows[i].length; j++) {
      const lang = languages[j - 1];
      const rawJson = rows[i][j];

      if (!rawJson) continue;

      try {
        const parsed = JSON.parse(rawJson);
        const filePath = path.join(websiteDir, `${lang}.json`);
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
        console.log(`✅ Saved: ${filePath}`);
      } catch (err) {
        console.error(`❌ Invalid JSON at [${website}][${lang}]`);
      }
    }
  }
}

main().catch(console.error);