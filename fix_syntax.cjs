const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  "  const deleteFromFirestore\n    try {",
  "  const deleteFromFirestore = async (collectionName: string, docId: string) => {\n    try {"
);

fs.writeFileSync('src/context/AppContext.tsx', code);
