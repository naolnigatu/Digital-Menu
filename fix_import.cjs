const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');
code = code.replace("  import { signInWithGoogle } from '../lib/firebase';\n", "");
code = "import { signInWithGoogle } from '../lib/firebase';\n" + code;
fs.writeFileSync('src/views/CustomerView.tsx', code);
