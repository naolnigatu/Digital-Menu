const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const replacement = `let usersQuery;
          if (currentUser?.role === 'super_admin') {
            usersQuery = collection(db, 'users');
          } else if (currentUser?.role === 'customer' && currentUser?.email) {
            usersQuery = query(collection(db, 'users'), where('email', '==', currentUser.email));
          } else if (!isGuest && targetTenantId) {
            usersQuery = query(collection(db, 'users'), where('tenantId', '==', targetTenantId));
          } else {
            usersQuery = emptyQueryUsers;
          }`;

code = code.replace(/const usersQuery = [^;]+;/, replacement);

fs.writeFileSync('src/context/AppContext.tsx', code);
