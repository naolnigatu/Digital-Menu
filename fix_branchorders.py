import re

with open("src/views/BusinessOwnerView.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const branchOrders = React.useMemo(() => orders.filter(o => o.branchId === activeBranchId), [orders, activeBranchId]);",
    "const branchOrders = React.useMemo(() => orders.filter(o => !activeBranchId || o.branchId === activeBranchId), [orders, activeBranchId]);"
)

with open("src/views/BusinessOwnerView.tsx", "w") as f:
    f.write(content)

with open("src/views/WaiterView.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const branchTables = React.useMemo(() => tables.filter(t => t.branchId === activeBranchId), [tables, activeBranchId]);",
    "const branchTables = React.useMemo(() => tables.filter(t => !activeBranchId || t.branchId === activeBranchId), [tables, activeBranchId]);"
)

with open("src/views/WaiterView.tsx", "w") as f:
    f.write(content)

with open("src/views/CashierView.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const activeUnpaidOrders = useMemo(() => orders.filter(\n    o => o.branchId === activeBranchId &&",
    "const activeUnpaidOrders = useMemo(() => orders.filter(\n    o => (!activeBranchId || o.branchId === activeBranchId) &&"
)
content = content.replace(
    "o => o.branchId === activeBranchId && o.paymentVerificationStatus === 'pending'",
    "o => (!activeBranchId || o.branchId === activeBranchId) && o.paymentVerificationStatus === 'pending'"
)
content = content.replace(
    "orders.filter(o => o.branchId === activeBranchId && o.paymentStatus === 'paid')",
    "orders.filter(o => (!activeBranchId || o.branchId === activeBranchId) && o.paymentStatus === 'paid')"
)

with open("src/views/CashierView.tsx", "w") as f:
    f.write(content)

