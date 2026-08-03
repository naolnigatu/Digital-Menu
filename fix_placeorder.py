import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_logic = """    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNum: `ORD-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      status: initialStatus,
      paymentStatus: (orderData as any).paymentStatus || (initialStatus === 'accepted' ? 'paid' : 'pending'),
      subtotal,
      tax: taxAmount,
      serviceCharge: serviceChargeAmount,
      total,
      timeline: [{
        id: `tl-${Date.now()}`,
        status: initialStatus,
        timestamp: new Date().toISOString(),
        note: 'Order placed'
      }]
    };"""

new_logic = """    let finalBranchId = orderData.branchId;
    if (!finalBranchId) {
      const tb = branches.filter(b => b.tenantId === orderData.tenantId);
      if (tb.length > 0) finalBranchId = tb[0].id;
    }

    const newOrder: Order = {
      ...orderData,
      branchId: finalBranchId,
      id: `ord-${Date.now()}`,
      orderNum: `ORD-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      status: initialStatus,
      paymentStatus: (orderData as any).paymentStatus || (initialStatus === 'accepted' ? 'paid' : 'pending'),
      subtotal,
      tax: taxAmount,
      serviceCharge: serviceChargeAmount,
      total,
      timeline: [{
        id: `tl-${Date.now()}`,
        status: initialStatus,
        timestamp: new Date().toISOString(),
        note: 'Order placed'
      }]
    };"""

content = content.replace(old_logic, new_logic)
with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
