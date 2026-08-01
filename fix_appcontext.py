import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

# Fix createBusiness
bad_block1 = """    setStaff(prev => {
        if (prev.some(s => s.id === id)) {
          return prev.map(s => s.id === id ? newStaff : s);
        }
        return [...prev, newStaff];
      });
    setCategories"""

good_block1 = """    setStaff(prev => {
        if (prev.some(s => s.id === ownerId)) {
          return prev.map(s => s.id === ownerId ? newStaff : s);
        }
        return [...prev, newStaff];
      });
    setCategories"""

content = content.replace(bad_block1, good_block1)

# Fix registerPlatformOwner
bad_block2 = """    setStaff(prev => {
        if (prev.some(s => s.id === id)) {
          return prev.map(s => s.id === id ? newStaff : s);
        }
        return [...prev, newStaff];
      });
    addLog('Platform Owner Sign Up'"""

good_block2 = """    setStaff(prev => {
        if (prev.some(s => s.id === ownerId)) {
          return prev.map(s => s.id === ownerId ? newStaff : s);
        }
        return [...prev, newStaff];
      });
    addLog('Platform Owner Sign Up'"""

content = content.replace(bad_block2, good_block2)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
