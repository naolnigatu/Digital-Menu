const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

const effectCode = `  useEffect(() => {
    if (activeCustomerOrder) {
      const updated = orders.find(o => o.id === activeCustomerOrder.id);
      if (updated && updated.status !== activeCustomerOrder.status) {
        setActiveCustomerOrder(updated);
      }
    }
  }, [orders, activeCustomerOrder]);`;

const replacement = `  useEffect(() => {
    if (activeCustomerOrder) {
      const updated = orders.find(o => o.id === activeCustomerOrder.id);
      if (updated && updated.status !== activeCustomerOrder.status) {
        setActiveCustomerOrder(updated);
      } else if (!updated && activeCustomerOrder.id) {
         // Guest mode live updates via direct polling or listener
         const checkUpdate = async () => {
             if (fetchOrderById) {
                 const latest = await fetchOrderById(activeCustomerOrder.id);
                 if (latest && latest.status !== activeCustomerOrder.status) {
                     setActiveCustomerOrder(latest);
                 }
             }
         };
         const interval = setInterval(checkUpdate, 5000);
         return () => clearInterval(interval);
      }
    }
  }, [orders, activeCustomerOrder, fetchOrderById]);`;

code = code.replace(effectCode, replacement);

fs.writeFileSync('src/views/CustomerView.tsx', code);
