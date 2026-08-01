import re

with open("src/context/AppContext.tsx", "r") as f:
    content = f.read()

old_set = "setStaff(prev => [...prev, newStaff]);"
new_set = """setStaff(prev => {
        if (prev.some(s => s.id === id)) {
          return prev.map(s => s.id === id ? newStaff : s);
        }
        return [...prev, newStaff];
      });"""

content = content.replace(old_set, new_set)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(content)
