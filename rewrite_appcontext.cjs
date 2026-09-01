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
    },
    {
        name: 'ordersQuery',
        pattern: /const targetOrdersTenantId = currentUser\?\.tenantId \|\| activeTenantId;\s*const ordersQuery = \([\s\S]*?\? collection\(db, 'orders'\)\s*: \([\s\S]*?\? query\(collection\(db, 'orders'\), where\('customerEmail', '==', currentUser\.email\)\)\s*: query\(collection\(db, 'orders'\), where\('tenantId', '==', targetOrdersTenantId\)\)\);/m,
        new: `const targetOrdersTenantId = activeTenantId || currentUser?.tenantId;
          let ordersQuery;
          if (currentUser?.role === 'super_admin') {
            ordersQuery = collection(db, 'orders');
          } else if (currentUser?.role === 'customer' && currentUser?.email) {
            ordersQuery = query(collection(db, 'orders'), where('customerEmail', '==', currentUser.email));
          } else if (currentUser && targetOrdersTenantId) {
            ordersQuery = query(collection(db, 'orders'), where('tenantId', '==', targetOrdersTenantId));
          } else {
            ordersQuery = emptyQueryOrders;
          }`
    },
    {
        name: 'reservationsQuery',
        pattern: /const reservationsQuery = [\s\S]*?\? collection\(db, 'reservations'\)[\s\S]*?: query\(collection\(db, 'reservations'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const reservationsQuery = currentUser?.role === 'super_admin' ? collection(db, 'reservations') : (isGuest ? emptyQueryReservations : (targetTenantId ? query(collection(db, 'reservations'), where('tenantId', '==', targetTenantId)) : emptyQueryReservations));`
    },
    {
        name: 'ingredientsQuery',
        pattern: /const ingredientsQuery = [\s\S]*?\? collection\(db, 'ingredients'\)[\s\S]*?: query\(collection\(db, 'ingredients'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const ingredientsQuery = currentUser?.role === 'super_admin' ? collection(db, 'ingredients') : (isGuest ? emptyQueryIngredients : (targetTenantId ? query(collection(db, 'ingredients'), where('tenantId', '==', targetTenantId)) : emptyQueryIngredients));`
    },
    {
        name: 'stockMovementsQuery',
        pattern: /const stockMovementsQuery = [\s\S]*?\? collection\(db, 'stock_movements'\)[\s\S]*?: query\(collection\(db, 'stock_movements'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const stockMovementsQuery = currentUser?.role === 'super_admin' ? collection(db, 'stock_movements') : (isGuest ? emptyQueryStock : (targetTenantId ? query(collection(db, 'stock_movements'), where('tenantId', '==', targetTenantId)) : emptyQueryStock));`
    },
    {
        name: 'notificationsQuery',
        pattern: /const notificationsQuery = [\s\S]*?\? collection\(db, 'notifications'\)[\s\S]*?: query\(collection\(db, 'notifications'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const notificationsQuery = currentUser?.role === 'super_admin' ? collection(db, 'notifications') : (isGuest ? emptyQueryNotifications : (targetTenantId ? query(collection(db, 'notifications'), where('tenantId', '==', targetTenantId)) : emptyQueryNotifications));`
    },
    {
        name: 'installedExtensionsQuery',
        pattern: /const installedExtensionsQuery = [\s\S]*?\? collection\(db, 'installed_extensions'\)[\s\S]*?: query\(collection\(db, 'installed_extensions'\), where\('tenantId', '==', targetTenantId\)\);/m,
        new: `const installedExtensionsQuery = currentUser?.role === 'super_admin' ? collection(db, 'installed_extensions') : (isGuest ? emptyQueryExtensions : (targetTenantId ? query(collection(db, 'installed_extensions'), where('tenantId', '==', targetTenantId)) : emptyQueryExtensions));`
    }
];

queriesToReplace.forEach(q => replaceQuery(q.name, q.pattern, q.new));

fs.writeFileSync('src/context/AppContext.tsx', code);
