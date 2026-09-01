const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Replace targetTenantId logic
code = code.replace(
    /const targetTenantId = currentUser\?\.tenantId \|\| activeTenantId;/g,
    `const targetTenantId = activeTenantId || currentUser?.tenantId;
          const isGuest = !currentUser || currentUser?.role === 'customer';
          const emptyQuery = query(collection(db, 'categories'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryOrders = query(collection(db, 'orders'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryUsers = query(collection(db, 'users'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryStaff = query(collection(db, 'staff'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryReservations = query(collection(db, 'reservations'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryIngredients = query(collection(db, 'ingredients'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryStock = query(collection(db, 'stock_movements'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryTables = query(collection(db, 'tables'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryStations = query(collection(db, 'stations'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryNotifications = query(collection(db, 'notifications'), where('id', '==', 'NONE_GUEST'));
          const emptyQueryExtensions = query(collection(db, 'installed_extensions'), where('id', '==', 'NONE_GUEST'));`
);

// We need to rewrite the query lines. Let's just use regex or AST. Regex is easier for simple lines.

function replaceQuery(collectionName, existingQueryPattern, newLogic) {
    code = code.replace(existingQueryPattern, newLogic);
}

const queriesToReplace = [
    {
        name: 'categoriesQuery',
        pattern: /const categoriesQuery = [\s\S]*?\? collection\(db, 'categories'\)[\s\S]*?: query\(collection\(db, 'categories'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const categoriesQuery = currentUser?.role === 'super_admin' ? collection(db, 'categories') : (targetTenantId ? query(collection(db, 'categories'), where('tenantId', '==', targetTenantId)) : emptyQuery);`
    },
    {
        name: 'menuItemsQuery',
        pattern: /const menuItemsQuery = [\s\S]*?\? collection\(db, 'menu_items'\)[\s\S]*?: query\(collection\(db, 'menu_items'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const menuItemsQuery = currentUser?.role === 'super_admin' ? collection(db, 'menu_items') : (targetTenantId ? query(collection(db, 'menu_items'), where('tenantId', '==', targetTenantId)) : emptyQuery);`
    },
    {
        name: 'staffQuery',
        pattern: /const staffQuery = [\s\S]*?\? collection\(db, 'staff'\)[\s\S]*?: query\(collection\(db, 'staff'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const staffQuery = currentUser?.role === 'super_admin' ? collection(db, 'staff') : (isGuest ? emptyQueryStaff : (targetTenantId ? query(collection(db, 'staff'), where('tenantId', '==', targetTenantId)) : emptyQueryStaff));`
    },
    {
        name: 'usersQuery',
        pattern: /const usersQuery = [\s\S]*?\? collection\(db, 'users'\)[\s\S]*?: query\(collection\(db, 'users'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const usersQuery = currentUser?.role === 'super_admin' ? collection(db, 'users') : (isGuest ? emptyQueryUsers : (targetTenantId ? query(collection(db, 'users'), where('tenantId', '==', targetTenantId)) : emptyQueryUsers));`
    },
    {
        name: 'branchesQuery',
        pattern: /const branchesQuery = [\s\S]*?\? collection\(db, 'branches'\)[\s\S]*?: query\(collection\(db, 'branches'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const branchesQuery = currentUser?.role === 'super_admin' ? collection(db, 'branches') : (targetTenantId ? query(collection(db, 'branches'), where('tenantId', '==', targetTenantId)) : emptyQuery);`
    },
    {
        name: 'tablesQuery',
        pattern: /const tablesQuery = [\s\S]*?\? collection\(db, 'tables'\)[\s\S]*?: query\(collection\(db, 'tables'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const tablesQuery = currentUser?.role === 'super_admin' ? collection(db, 'tables') : (targetTenantId ? query(collection(db, 'tables'), where('tenantId', '==', targetTenantId)) : emptyQueryTables);`
    },
    {
        name: 'stationsQuery',
        pattern: /const stationsQuery = [\s\S]*?\? collection\(db, 'stations'\)[\s\S]*?: query\(collection\(db, 'stations'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const stationsQuery = currentUser?.role === 'super_admin' ? collection(db, 'stations') : (targetTenantId ? query(collection(db, 'stations'), where('tenantId', '==', targetTenantId)) : emptyQueryStations);`
    }
];

queriesToReplace.forEach(q => replaceQuery(q.name, q.pattern, q.new));

fs.writeFileSync('src/context/AppContext.tsx', code);
