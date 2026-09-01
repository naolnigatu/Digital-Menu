const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

code = code.replace(
  "const [myOrderIds, setMyOrderIds] = useState<string[]>(() => {\n    try {\n      return JSON.parse(localStorage.getItem('mf_my_orders') || '[]');\n    } catch {\n      return [];\n    }\n  });",
  "const [myOrderIds, setMyOrderIds] = useState<string[]>(() => {\n    try {\n      return JSON.parse(localStorage.getItem('mf_my_orders') || '[]');\n    } catch {\n      return [];\n    }\n  });\n  const [deviceOrders, setDeviceOrders] = useState<Order[]>([]);\n  useEffect(() => {\n    if (myOrderIds.length > 0 && fetchOrderById) {\n      Promise.all(myOrderIds.map(id => fetchOrderById(id))).then(res => {\n        setDeviceOrders(res.filter(Boolean) as Order[]);\n      });\n    }\n  }, [myOrderIds, fetchOrderById]);"
);

code = code.replace(
  /\{orders\n\s*\.filter\(o => myOrderIds\.includes\(o\.id\)\)/,
  `{(orders.length > 0 ? orders.filter(o => myOrderIds.includes(o.id)) : deviceOrders)`
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
