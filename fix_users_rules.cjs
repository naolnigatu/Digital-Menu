const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(/match \/users\/\{userId\} \{\n      allow read: if isSuperAdmin\(\) \|\| request\.auth\.uid == userId;\n      allow write: if isSuperAdmin\(\) \|\| request\.auth\.uid == userId;\n    \}/, 
`match /users/{userId} {
      allow read: if request.auth != null && (isSuperAdmin() || request.auth.uid == userId || (resource != null && resource.data.email == request.auth.token.email));
      allow write: if request.auth != null && (isSuperAdmin() || request.auth.uid == userId || (resource != null && resource.data.email == request.auth.token.email) || (request.resource != null && request.resource.data.email == request.auth.token.email));
    }`);

fs.writeFileSync('firestore.rules', code);
