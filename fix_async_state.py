import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

# Fix updateLoyaltyPoints
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
          id: `lh-${Date.now() + 1}`,
          date: new Date().toISOString(),
          points: redeemPoints,
          type: 'redeem',
          orderNum: targetOrder.orderNum,
          description: `Redeemed on order ${targetOrder.orderNum}`
        }] : [];
        const updated = {
          ...current,
          loyaltyPoints: updatedPoints,
          loyaltyHistory: [...current.loyaltyHistory, newHistoryEntry, ...redeemHistoryEntry]
        };
        
        await syncToFirestore('users', updated.id, updated);
        
        return {
          ...prev,
          [email]: updated
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
        id: `lh-${Date.now() + 1}`,
        date: new Date().toISOString(),
        points: redeemPoints,
        type: 'redeem',
        orderNum: targetOrder.orderNum,
        description: `Redeemed on order ${targetOrder.orderNum}`
      }] : [];
      const updated = {
        ...current,
        loyaltyPoints: updatedPoints,
        loyaltyHistory: [...current.loyaltyHistory, newHistoryEntry, ...redeemHistoryEntry]
      };
      
      setCustomerProfiles(prev => ({
        ...prev,
        [email]: updated
      }));
      syncToFirestore('users', updated.id, updated);"""

content = content.replace(old_updateLoyaltyPoints, new_updateLoyaltyPoints)

# Fix updateCustomerProfile
old_updateCustomerProfile = """    setCustomerProfiles(async prev => {
      const current = prev[email] || {
        id: `cust-${Date.now()}`,
        email,
        name: profileData.name || email.split('@')[0],
        phone: profileData.phone || '',
        savedAddresses: [],
        savedFavorites: [],
        loyaltyPoints: 0,
        loyaltyHistory: []
      };
      const updated = {
        ...current,
        ...profileData
      };
      await syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });"""

new_updateCustomerProfile = """    const current = customerProfiles[email] || {
      id: `cust-${Date.now()}`,
      email,
      name: profileData.name || email.split('@')[0],
      phone: profileData.phone || '',
      savedAddresses: [],
      savedFavorites: [],
      loyaltyPoints: 0,
      loyaltyHistory: []
    };
    const updated = {
      ...current,
      ...profileData
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);"""
content = content.replace(old_updateCustomerProfile, new_updateCustomerProfile)

# Fix addSavedFavorite
old_addSavedFavorite = """    setCustomerProfiles(async prev => {
      const current = prev[email] || {
        id: `cust-${Date.now()}`,
        email,
        name: email.split('@')[0],
        phone: '',
        savedAddresses: [],
        savedFavorites: [],
        loyaltyPoints: 0,
        loyaltyHistory: []
      };
      const updated = {
        ...current,
        savedFavorites: [...new Set([...current.savedFavorites, menuItemId])]
      };
      await syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });"""

new_addSavedFavorite = """    const current = customerProfiles[email] || {
      id: `cust-${Date.now()}`,
      email,
      name: email.split('@')[0],
      phone: '',
      savedAddresses: [],
      savedFavorites: [],
      loyaltyPoints: 0,
      loyaltyHistory: []
    };
    const updated = {
      ...current,
      savedFavorites: [...new Set([...current.savedFavorites, menuItemId])]
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);"""
content = content.replace(old_addSavedFavorite, new_addSavedFavorite)

# Fix removeSavedFavorite
old_removeSavedFavorite = """    setCustomerProfiles(async prev => {
      const current = prev[email];
      if (!current) return prev;
      const updated = {
        ...current,
        savedFavorites: current.savedFavorites.filter(id => id !== menuItemId)
      };
      await syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });"""

new_removeSavedFavorite = """    const current = customerProfiles[email];
    if (!current) return;
    const updated = {
      ...current,
      savedFavorites: current.savedFavorites.filter(id => id !== menuItemId)
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);"""
content = content.replace(old_removeSavedFavorite, new_removeSavedFavorite)

# Fix addSavedAddress
old_addSavedAddress = """    setCustomerProfiles(async prev => {
      const current = prev[email] || {
        id: `cust-${Date.now()}`,
        email,
        name: email.split('@')[0],
        phone: '',
        savedAddresses: [],
        savedFavorites: [],
        loyaltyPoints: 0,
        loyaltyHistory: []
      };
      const newAddress = {
        id: `addr-${Date.now()}`,
        name,
        address
      };
      const updated = {
        ...current,
        savedAddresses: [...current.savedAddresses, newAddress]
      };
      await syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });"""

new_addSavedAddress = """    const current = customerProfiles[email] || {
      id: `cust-${Date.now()}`,
      email,
      name: email.split('@')[0],
      phone: '',
      savedAddresses: [],
      savedFavorites: [],
      loyaltyPoints: 0,
      loyaltyHistory: []
    };
    const newAddress = {
      id: `addr-${Date.now()}`,
      name,
      address
    };
    const updated = {
      ...current,
      savedAddresses: [...current.savedAddresses, newAddress]
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);"""
content = content.replace(old_addSavedAddress, new_addSavedAddress)

# Fix removeSavedAddress
old_removeSavedAddress = """    setCustomerProfiles(async prev => {
      const current = prev[email];
      if (!current) return prev;
      const updated = {
        ...current,
        savedAddresses: current.savedAddresses.filter(a => a.id !== addressId)
      };
      await syncToFirestore('users', updated.id, updated);
      return {
        ...prev,
        [email]: updated
      };
    });"""

new_removeSavedAddress = """    const current = customerProfiles[email];
    if (!current) return;
    const updated = {
      ...current,
      savedAddresses: current.savedAddresses.filter(a => a.id !== addressId)
    };
    setCustomerProfiles(prev => ({
      ...prev,
      [email]: updated
    }));
    syncToFirestore('users', updated.id, updated);"""
content = content.replace(old_removeSavedAddress, new_removeSavedAddress)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)

