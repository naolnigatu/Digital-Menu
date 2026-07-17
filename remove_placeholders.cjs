const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // Regex to remove placeholder="..." or placeholder='...' or placeholder={`...`}
      content = content.replace(/\bplaceholder=(["'])(?:(?=(\\?))\2.)*?\1/g, '');
      content = content.replace(/\bplaceholder=\{[^\}]*\}/g, '');
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Removed placeholders in', fullPath);
      }
    }
  }
}

processDir('./src');
