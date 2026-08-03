import re

with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "branchOrders.filter(o => o.status === 'pending').length",
    "branchOrders.filter(o => o.status === 'pending' || o.status === 'pending_approval').length"
)
content = content.replace(
    "if (activeOrderView === 'active') return ['pending', 'preparing', 'ready', 'accepted'].includes(o.status);",
    "if (activeOrderView === 'active') return ['pending', 'pending_approval', 'preparing', 'ready', 'accepted'].includes(o.status);"
)

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)
