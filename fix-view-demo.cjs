const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

// Replace all \`onClick={onEnterApp}\` with scrolling logic or anchor tags for View Demo
code = code.replace(
  /<button[\s\S]*?onClick=\{onEnterApp\}[\s\S]*?View Demo[\s\S]*?<\/button>/g,
  (match) => {
    return match.replace('<button', '<a href="#demo-video"').replace('onClick={onEnterApp}', '').replace('</button>', '</a>');
  }
);

fs.writeFileSync('src/views/LandingPageView.tsx', code);
