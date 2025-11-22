/* eslint-env node */
const fs = require('fs');
const path = require('path');

const outputFile = path.join(process.cwd(), 'assets/quran/map.ts');

let content = 'const surahMap: { [key: string]: any } = {\n';

for (let i = 1; i <= 114; i++) {
  // Pad index with leading zeros to match filename format if needed, 
  // but the download script saved them as surah_1.json, surah_2.json etc.
  // Wait, let's check the download script again.
  // "curl -s ... -o assets/quran/surah/surah_$i.json"
  // So filenames are surah_1.json, surah_2.json...
  
  // But the index in surah.json is "001", "002".
  // We should handle both or normalize.
  // Let's use the string index "001" as key to match the route param.
  
  const indexStr = i.toString().padStart(3, '0');
  content += `  "${indexStr}": require("./surah/surah_${i}.json"),\n`;
}

content += '};\n\nexport default surahMap;';

fs.writeFileSync(outputFile, content);
console.log('Map generated at ' + outputFile);
