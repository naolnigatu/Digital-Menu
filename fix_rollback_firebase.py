import re

with open("src/lib/firebase.ts", "r") as f:
    content = f.read()

new_func = """
export const rollbackSecondaryUser = async (email: string, pass: string) => {
  if (!firebaseConfig.apiKey) return;
  try {
    const { deleteUser, signInWithEmailAndPassword } = await import('firebase/auth');
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);
    const result = await signInWithEmailAndPassword(secondaryAuth, email, pass);
    if (result.user) {
      await deleteUser(result.user);
    }
  } catch (err) {
    console.error("Rollback failed:", err);
  }
};
"""

if "rollbackSecondaryUser" not in content:
    content = content.replace("export const createSecondaryUser", new_func + "\nexport const createSecondaryUser")

with open("src/lib/firebase.ts", "w") as f:
    f.write(content)
