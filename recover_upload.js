const fs = require('fs');
const lines = fs.readFileSync('C:/Users/ASUS/.gemini/antigravity-ide/brain/de8ab3d0-6dba-4323-86db-8899f783c5d3/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
let content = '';

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('upload/page.tsx') || lines[i].includes('upload\\\\page.tsx')) {
    const match = lines[i].match(/"CodeContent":"(.*?)","IsArtifact/);
    if (match) {
      content = match[1];
      break;
    }
  }
}

if (content) {
  content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  fs.writeFileSync('recover_upload.tsx', content);
  console.log('Found it!');
} else {
  console.log('Not found');
}
