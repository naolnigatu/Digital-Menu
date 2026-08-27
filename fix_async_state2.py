import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

# Fix updateLoyaltyPoints async which failed previously
old_updateLoyaltyPoints = """      setCustomerProfiles(async prev => {
        const current = prev[email] || {
          id: `cust-${Date.now()}`,
          email,
          name: targetOrder.customerName || email.split('@')[0],
          phone: targetOrder.customerPhone || '',
          savedAddresses: [],
          savedFavorites: [],
          loyaltyPoints: 0,
          loyaltyHistory: []
        };
        const updatedPoints = Math.max(0, current.loyaltyPoints + loyaltyEarned - redeemPoints);
        const newHistoryEntry: LoyaltyHistoryEntry = {
          id: `lh-${Date.now()}`,
          date: new Date().toISOString(),
          points: loyaltyEarned,
          type: 'earn',
          orderNum: targetOrder.orderNum,
          description: `Earned on order ${targetOrder.orderNum}`
        };
        const redeemHistoryEntry: LoyaltyHistoryEntry[] = redeemPoints > 0 ? [{
          id: `lh-${Date.now()}-red`,
          date: new Date().toISOString(),
          points: -redeemPoints,
          type: 'redeem' as const,
          orderNum: targetOrder.orderNum,
          description: `Redeemed on order ${targetOrder.orderNum}`
        }] : [];
        const updated = {
          ...current,
          loyaltyPoints: updatedPoints,
          loyaltyHistory: [...current.loyaltyHistory, newHistoryEntry, ...redeemHistoryEntry]
        };
        const updatedProfile = {
          ...current,
          loyaltyPoints: updatedPoints,
          loyaltyHistory: [...current.loyaltyHistory, newHistoryEntry, ...redeemHistoryEntry]
        };
        await syncToFirestore('users', updatedProfile.id, updatedProfile);
        return {
          ...prev,
          [email]: updatedProfile
        };
      });"""

new_updateLoyaltyPoints = """      const current = customerProfiles[email] || {
        id: `cust-${Date.now()}`,
        email,
        name: targetOrder.customerName || email.split('@')[0],
        phone: targetOrder.customerPhone || '',
        savedAddresses: [],
        savedFavorites: [],
        loyaltyPoints: 0,
        loyaltyHistory: []
      };
      const updatedPoints = Math.max(0, current.loyaltyPoints + loyaltyEarned - redeemPoints);
      const newHistoryEntry: LoyaltyHistoryEntry = {
        id: `lh-${Date.now()}`,
        date: new Date().toISOString(),
        points: loyaltyEarned,
        type: 'earn',
        orderNum: targetOrder.orderNum,
        description: `Earned on order ${targetOrder.orderNum}`
      };
      const redeemHistoryEntry: LoyaltyHistoryEntry[] = redeemPoints > 0 ? [{
        id: `lh-${Date.now()}-red`,
        date: new Date().toISOString(),
        points: -redeemPoints,
        type: 'redeem' as const,
        orderNum: targetOrder.orderNum,
        description: `Redeemed on order ${targetOrder.orderNum}`
      }] : [];
      const updatedProfile = {
        ...current,
        loyaltyPoints: updatedPoints,
        loyaltyHistory: [...current.loyaltyHistory, newHistoryEntry, ...redeemHistoryEntry]
      };
      setCustomerProfiles(prev => ({
        ...prev,
        [email]: updatedProfile
      }));
      syncToFirestore('users', updatedProfile.id, updatedProfile);"""

# Sometimes it's slightly different in the file, let's use re.sub for safety

pattern = r"setCustomerProfiles\(async prev => \{.*?(?:return \{.*?\};\s*\}\);)"
# Wait, let's just do it manually with regex.
