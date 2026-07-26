const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Replace the start of initializeListeners
let target = `    const initializeListeners = async () => {
      try {
        const {`;

let replacement = `    const initializeListeners = async () => {
      try {
        const { query, where } = await import('firebase/firestore');
        const {`;
content = content.replace(target, replacement);

fs.writeFileSync('src/context/AppContext.tsx', content);
