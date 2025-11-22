/* eslint-env node */
const fs = require('fs');
const path = require('path');

const langs = ['en', 'id'];

langs.forEach(lang => {
  const outputFile = path.join(process.cwd(), `assets/quran/translation/${lang}/map.ts`);
  let content = 'const translationMap: { [key: string]: any } = {\n';

  for (let i = 1; i <= 114; i++) {
    const indexStr = i.toString().padStart(3, '0');
    // Filenames are like en_translation_1.json
    content += `  "${indexStr}": require("./${lang}_translation_${i}.json"),\n`;
  }

  content += '};\n\nexport default translationMap;';

  fs.writeFileSync(outputFile, content);
  console.log(`Map generated for ${lang} at ${outputFile}`);
});
