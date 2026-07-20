const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPageView.tsx', 'utf-8');

const oldLogin = `  const handleLogin = async () => {
    setIsLoginLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      // Fallback
      login('demo@menuflow.com');
    } finally {
      setIsLoginLoading(false);
    }
  };`;

const newLogin = `  const handleLogin = async () => {
    setIsLoginLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user && user.email) {
        login(user.email);
      } else {
        login('demo@menuflow.com');
      }
    } catch (error) {
      console.error(error);
      // Fallback
      login('demo@menuflow.com');
    } finally {
      setIsLoginLoading(false);
    }
  };`;

code = code.replace(oldLogin, newLogin);
fs.writeFileSync('src/views/LandingPageView.tsx', code);
