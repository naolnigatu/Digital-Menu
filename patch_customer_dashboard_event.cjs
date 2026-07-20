const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const eventListener = `
  useEffect(() => {
    const handleOpenDashboard = () => {
      if (customerEmailForDashboard) {
        setIsDashboardOpen(true);
      } else {
        setIsEmailLoginModalOpen(true);
      }
    };
    window.addEventListener('open-customer-dashboard', handleOpenDashboard);
    return () => window.removeEventListener('open-customer-dashboard', handleOpenDashboard);
  }, [customerEmailForDashboard]);
`;

code = code.replace(
  /  const currentLiveOrder = activeCustomerOrder /,
  eventListener + "\n  const currentLiveOrder = activeCustomerOrder "
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
