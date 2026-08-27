import re

with open("firestore.rules", "r") as f:
    content = f.read()

content = content.replace("    match /users/{userId} {\n      allow read, write: if request.auth != null;\n    }", "    match /users/{userId} {\n      allow read, write: if true;\n    }")

with open("firestore.rules", "w") as f:
    f.write(content)
