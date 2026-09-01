const fs = require('fs');
let code = fs.readFileSync('src/views/CustomerView.tsx', 'utf8');

// We need to import fetchOrderById from AppContext. It's returned by useApp().
code = code.replace(
  "    updateCustomerMealSubscription,\n  } = useApp();",
  "    updateCustomerMealSubscription,\n    fetchOrderById\n  } = useApp();"
);

// We need to fix the search click handler
code = code.replace(
  /onClick=\{\(\) => \{\n\s*const query = trackSearchQuery\.trim\(\);\n[\s\S]*?Search & Track\n\s*<\/button>/,
  `onClick={async () => {
                      const query = trackSearchQuery.trim();
                      if (!query) {
                        setTrackError("Please enter an Order ID.");
                        return;
                      }
                      
                      const cleanQuery = query.toLowerCase();
                      const sanitizedQueryPhone = sanitizePhoneInput(query);
                      let foundOrder = orders.find(o => 
                        (o.id || '').toLowerCase() === cleanQuery ||
                        (o.id || '').toLowerCase().includes(cleanQuery) ||
                        (o.orderNum || '').toLowerCase() === cleanQuery ||
                        (o.orderNum || '').toLowerCase().includes(cleanQuery) ||
                        (o.customerPhone && (o.customerPhone === query || o.customerPhone === sanitizedQueryPhone || o.customerPhone.includes(sanitizedQueryPhone))) ||
                        (o.customerEmail && o.customerEmail.toLowerCase() === cleanQuery)
                      );

                      if (!foundOrder && fetchOrderById) {
                         // Try fetching directly by ID if it wasn't found in local context (happens for guests)
                         foundOrder = await fetchOrderById(query) || undefined;
                      }

                      if (foundOrder) {
                        setActiveCustomerOrder(foundOrder);
                        setIsTrackModalOpen(false);
                      } else {
                        setTrackError("No orders found matching your query (must be exact Order ID).");
                      }
                    }}
                    className="w-full rounded-lg bg-indigo-600 text-white font-bold py-2 text-xs hover:bg-indigo-500 transition-colors"
                  >
                    Search & Track
                  </button>`
);

fs.writeFileSync('src/views/CustomerView.tsx', code);
