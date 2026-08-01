import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_categories = "const categoriesQuery = collection(db, 'categories');"
new_categories = """const categoriesQuery = (currentUser?.role === 'super_admin' || currentUser?.role === 'customer' || !currentUser)
            ? collection(db, 'categories')
            : query(collection(db, 'categories'), where('tenantId', '==', targetTenantId));"""
content = content.replace(old_categories, new_categories)

old_menuitems = "const menuItemsQuery = collection(db, 'menu_items');"
new_menuitems = """const menuItemsQuery = (currentUser?.role === 'super_admin' || currentUser?.role === 'customer' || !currentUser)
            ? collection(db, 'menu_items')
            : query(collection(db, 'menu_items'), where('tenantId', '==', targetTenantId));"""
content = content.replace(old_menuitems, new_menuitems)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
