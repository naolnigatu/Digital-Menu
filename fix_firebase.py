with open("src/lib/firebase.ts", "r") as f:
    content = f.read()

new_func = """
export const createSecondaryUser = async (email: string, pass: string) => {
  if (!firebaseConfig.apiKey) throw new Error("Firebase not initialized");
  const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
  const secondaryAuth = getAuth(secondaryApp);
  const result = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
  await signOut(secondaryAuth);
  return result.user;
};
"""

if "createSecondaryUser" not in content:
    content += new_func

with open("src/lib/firebase.ts", "w") as f:
    f.write(content)
