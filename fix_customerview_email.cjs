const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');
code = code.replace(
  "const [customerEmailForDashboard, setCustomerEmailForDashboard] = useState(() => {\n    return localStorage.getItem('mf_customer_logged_email') || '';\n  });",
  "const [customerEmailForDashboard, setCustomerEmailForDashboard] = useState(() => {\n    return localStorage.getItem('mf_customer_logged_email') || '';\n  });\n  useEffect(() => {\n    if (currentUser?.email) {\n      setCustomerEmailForDashboard(currentUser.email);\n      localStorage.setItem('mf_customer_logged_email', currentUser.email);\n    } else if (!currentUser && customerEmailForDashboard) {\n      // Only wipe if they explicitly logged out from firebase auth, but for now we can leave it to avoid breaking guest flows, \n      // since firestore rules protect actual data\n    }\n  }, [currentUser]);"
);
fs.writeFileSync('src/views/CustomerView.tsx', code);
