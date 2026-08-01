with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_block = """  const updateOrderStatus = async (orderId: string, status: OrderStatus, actor?: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    let items = [...existing.items];
    if (status === 'preparing') {"""

new_block = """  const updateOrderStatus = async (orderId: string, status: OrderStatus, actor?: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;
    let items = [...existing.items];
    let estimatedReadyTime = existing.estimatedReadyTime;
    if (status === 'accepted' && !estimatedReadyTime) {
      let maxPrep = 15;
      existing.items.forEach(it => {
        const p = it.item.prepTime || 15;
        if (p > maxPrep) maxPrep = p;
      });
      estimatedReadyTime = new Date(Date.now() + maxPrep * 60000).toISOString();
    }
    if (status === 'preparing') {"""

content = content.replace(old_block, new_block)

old_update = """    const updated: Order = {
      ...existing,
      status,
      items,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), newEvent]
    };"""

new_update = """    const updated: Order = {
      ...existing,
      status,
      items,
      estimatedReadyTime,
      updatedAt: new Date().toISOString(),
      timeline: [...(existing.timeline || []), newEvent]
    };"""

content = content.replace(old_update, new_update)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
