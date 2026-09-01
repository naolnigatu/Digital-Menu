const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');
code = code.replace("const { signInWithGoogle } = require('../lib/firebase');", "import { signInWithGoogle } from '../lib/firebase';");
fs.writeFileSync('src/views/CustomerView.tsx', code);
