import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_code = """          const unsubscribeOrders = onSnapshot(ordersQuery, snapshot => {
            const list: Order[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as Order);
            });
            setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          }, err => console.warn("Orders listener error:", err));"""

new_code = """          const unsubscribeOrders = onSnapshot(ordersQuery, snapshot => {
            console.log("ORDERS QUERY RESULT:", snapshot.docs.length, "for tenantId:", targetOrdersTenantId);
            const list: Order[] = [];
            snapshot.forEach(docSnap => {
              list.push({
                id: docSnap.id,
                ...docSnap.data()
              } as Order);
            });
            setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          }, err => console.warn("Orders listener error:", err));"""

content = content.replace(old_code, new_code)
with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
