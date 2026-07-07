import { Tenant, Branch, PreparationStation, Category, MenuItem, Table, Order, Staff, SystemLog, PlatformStats } from '../types';

export const mockTenants: Tenant[] = [
  {
    id: 't-01',
    name: "Aisha's Traditional Kitchen",
    slug: 'aishas-kitchen',
    logoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80',
    description: 'Authentic Ethiopian dining in the heart of Addis Ababa, serving freshly cooked traditional platters, stews, and hand-brewed coffee.',
    currency: 'ETB',
    currencySymbol: 'Br',
    baseTaxRate: 15,
    serviceCharge: 5,
    subscriptionPlan: 'growth',
    subscriptionStatus: 'active',
    ownerEmail: 'aisha@menuflow.com',
    createdAt: '2026-01-15T08:00:00Z',
    loyaltyPointsRatio: 0.1, // 1 point per 10 ETB
    loyaltyMinRedeemPoints: 50,
    loyaltyRedeemValue: 1, // 1 point = 1 ETB
    bankAccount: 'Commercial Bank of Ethiopia (CBE) - 1000123456789',
  },
  {
    id: 't-02',
    name: "Carlos's Specialty Espresso",
    slug: 'carlos-espresso',
    logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&auto=format&fit=crop&q=80',
    description: 'A third-wave specialty coffee roaster and bakery in Nairobi, dedicated to single-origin beans and freshly baked sourdough pastries.',
    currency: 'USD',
    currencySymbol: '$',
    baseTaxRate: 16,
    serviceCharge: 0,
    subscriptionPlan: 'enterprise',
    subscriptionStatus: 'active',
    ownerEmail: 'carlos@menuflow.com',
    createdAt: '2026-03-10T09:30:00Z',
    loyaltyPointsRatio: 0.05, // 1 point per 20 USD
    loyaltyMinRedeemPoints: 10,
    loyaltyRedeemValue: 1, // 1 point = 1 USD
    bankAccount: 'Nairobi Equity Bank - 5502938475',
  }
];

export const mockBranches: Branch[] = [
  {
    id: 'b-01',
    tenantId: 't-01',
    name: 'Bole Road Branch',
    address: 'Cameroon Street, Bole, Addis Ababa, Ethiopia',
    phone: '+251 11 662 4589'
  },
  {
    id: 'b-02',
    tenantId: 't-01',
    name: 'Sarbet Branch',
    address: 'Pushkin Square, Sarbet, Addis Ababa, Ethiopia',
    phone: '+251 11 371 8944'
  },
  {
    id: 'b-03',
    tenantId: 't-02',
    name: 'Westlands Roastery',
    address: 'Woodvale Grove, Westlands, Nairobi, Kenya',
    phone: '+254 20 444 1234'
  }
];

export const mockStations: PreparationStation[] = [
  // Aisha's Bole Road stations
  { id: 'st-01', branchId: 'b-01', name: 'Hot Stews Station' },
  { id: 'st-02', branchId: 'b-01', name: 'Grill & Tibs Station' },
  { id: 'st-03', branchId: 'b-01', name: 'Traditional Beverage Bar' },
  
  // Carlos's Westlands stations
  { id: 'st-04', branchId: 'b-03', name: 'Espresso Bar' },
  { id: 'st-05', branchId: 'b-03', name: 'Bakery & Dessert Station' },
  { id: 'st-06', branchId: 'b-03', name: 'Hot Breakfast Station' }
];

export const mockCategories: Record<string, Category[]> = {
  't-01': [
    { id: 'cat-01', tenantId: 't-01', name: 'Signature Platters', orderNum: 1, icon: 'Soup', translations: { am: 'ልዩ መሶብ' } },
    { id: 'cat-02', tenantId: 't-01', name: 'Traditional Stews (Wat)', orderNum: 2, icon: 'Flame', translations: { am: 'ባህላዊ ወጦች' } },
    { id: 'cat-03', tenantId: 't-01', name: 'Ethiopian Tibs (Grills)', orderNum: 3, icon: 'Beef', translations: { am: 'ጥብስና ጥብስ' } },
    { id: 'cat-04', tenantId: 't-01', name: 'Hot & Cold Drinks', orderNum: 4, icon: 'Coffee', translations: { am: 'ትኩስና ቀዝቃዛ መጠጦች' } }
  ],
  't-02': [
    { id: 'cat-05', tenantId: 't-02', name: 'Specialty Espresso', orderNum: 1, icon: 'Coffee' },
    { id: 'cat-06', tenantId: 't-02', name: 'Artisanal Bakery', orderNum: 2, icon: 'Croissant' },
    { id: 'cat-07', tenantId: 't-02', name: 'Healthy Breakfast Bowls', orderNum: 3, icon: 'Egg' }
  ]
};

export const mockMenuItems: Record<string, MenuItem[]> = {
  't-01': [
    {
      id: 'item-01',
      categoryId: 'cat-01',
      tenantId: 't-01',
      name: 'Beyaynetu (Veggie Platter)',
      description: 'A colorful assortment of authentic lentil, chickpea, split pea, cabbage, and spinach stews served on organic Injera flatbread.',
      price: 320,
      photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
      allergenTags: ['Gluten (Optional)'],
      dietaryTags: ['Vegan', 'Vegetarian'],
      isAvailable: true,
      preparationStationId: 'st-01',
      translations: {
        am: {
          name: 'የጾም በያይነቱ',
          description: 'የተለያዩ የጥራጥሬ ወጦች (ምስር፣ ሽሮ፣ ክክ አልጫ፣ ጎመን) ከኦርጋኒክ እንጀራ ጋር የቀረበ።'
        }
      },
      modifiers: [
        {
          id: 'mod-01',
          name: 'Injera Selection',
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'opt-01', name: 'Standard Mixed Injera', price: 0 },
            { id: 'opt-02', name: '100% Pure Teff Injera', price: 40 }
          ]
        },
        {
          id: 'mod-02',
          name: 'Extra Portion',
          minSelect: 0,
          maxSelect: 2,
          options: [
            { id: 'opt-03', name: 'Add Extra Shiro', price: 50 },
            { id: 'opt-04', name: 'Add Extra Salad', price: 30 }
          ]
        }
      ]
    },
    {
      id: 'item-02',
      categoryId: 'cat-02',
      tenantId: 't-01',
      name: 'Doro Wat (Royal Chicken Stew)',
      description: 'The national dish of Ethiopia: tender chicken slow-cooked with spiced Berbere, hard-boiled eggs, and authentic spiced butter, served on fresh Injera.',
      price: 480,
      photoUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb49785?w=500&auto=format&fit=crop&q=80', // close traditional representation
      allergenTags: ['Dairy'],
      dietaryTags: ['Traditional'],
      isAvailable: true,
      preparationStationId: 'st-01',
      translations: {
        am: {
          name: 'የሀገር ባህል ዶሮ ወጥ',
          description: 'ለረጅም ሰዓታት በበርበሬ እና በቅቤ የበሰለ የዶሮ ስጋ ከእንቁላል እና ከእንጀራ ጋር።'
        }
      },
      modifiers: [
        {
          id: 'mod-03',
          name: 'Injera Choice',
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'opt-05', name: 'Standard Injera', price: 0 },
            { id: 'opt-06', name: 'Pure Teff Injera', price: 40 }
          ]
        },
        {
          id: 'mod-04',
          name: 'Extra Egg',
          minSelect: 0,
          maxSelect: 1,
          options: [
            { id: 'opt-07', name: 'One Additional Boiled Egg', price: 30 }
          ]
        }
      ]
    },
    {
      id: 'item-03',
      categoryId: 'cat-03',
      tenantId: 't-01',
      name: 'Shekla Tibs',
      description: 'Strips of tender rib-eye beef pan-fried with onions, garlic, green chilies, and rosemary. Served in a sizzling clay pot over hot coals.',
      price: 490,
      photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
      allergenTags: [],
      dietaryTags: ['Halal', 'High Protein'],
      isAvailable: true,
      preparationStationId: 'st-02',
      translations: {
        am: {
          name: 'የሸክላ ጥብስ',
          description: 'በሸክላ ድስት የቀረበ የከብት ስጋ በሽንኩርት፣ ቃሪያ እና በቅቤ የተጠበሰ።'
        }
      },
      modifiers: [
        {
          id: 'mod-05',
          name: 'Spice Preference',
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'opt-08', name: 'Regular Traditional Spiced', price: 0 },
            { id: 'opt-09', name: 'Mild (Non-spicy)', price: 0 }
          ]
        }
      ]
    },
    {
      id: 'item-04',
      categoryId: 'cat-04',
      tenantId: 't-01',
      name: 'Traditional Ethiopian Coffee Ceremony',
      description: 'Experience the full coffee ritual: fresh beans roasted on-site, ground by hand, brewed in a traditional clay "Jebena," served with popcorn.',
      price: 120,
      photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
      allergenTags: [],
      dietaryTags: ['Vegan', 'Local Tradition'],
      isAvailable: true,
      preparationStationId: 'st-03',
      translations: {
        am: {
          name: 'የባህል ጀበና ቡና ሥነ-ስርዓት',
          description: 'በጀበና የተፈላ ቡና ከፈንድሻ እና ከዕጣን ጋር የቀረበ።'
        }
      },
      modifiers: [
        {
          id: 'mod-06',
          name: 'Sweetener',
          minSelect: 1,
          maxSelect: 2,
          options: [
            { id: 'opt-10', name: 'With Sugar', price: 0 },
            { id: 'opt-11', name: 'With Cardamom Spice', price: 10 },
            { id: 'opt-12', name: 'Traditional Salt Flavor', price: 0 }
          ]
        }
      ]
    }
  ],
  't-02': [
    {
      id: 'item-05',
      categoryId: 'cat-05',
      tenantId: 't-02',
      name: 'Single-Origin Flat White',
      description: 'Double shot of single-origin beans sourced from Nyeri County, steamed with textured whole milk producing silky sweet micro-foam.',
      price: 3.80,
      photoUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&auto=format&fit=crop&q=80',
      allergenTags: ['Dairy'],
      dietaryTags: ['Specialty Brew'],
      isAvailable: true,
      preparationStationId: 'st-04',
      modifiers: [
        {
          id: 'mod-07',
          name: 'Milk Choice',
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'opt-13', name: 'Standard Cow Milk', price: 0 },
            { id: 'opt-14', name: 'Artisanal Oat Milk', price: 0.80 },
            { id: 'opt-15', name: 'Organic Almond Milk', price: 0.70 }
          ]
        },
        {
          id: 'mod-08',
          name: 'Espresso Double Shot',
          minSelect: 0,
          maxSelect: 1,
          options: [
            { id: 'opt-16', name: 'Add Extra Shot (Triple)', price: 0.60 }
          ]
        }
      ]
    },
    {
      id: 'item-06',
      categoryId: 'cat-06',
      tenantId: 't-02',
      name: 'Freshly Baked Almond Croissant',
      description: 'Double-baked, buttery sourdough croissant filled with frangipane (almond cream) and topped with roasted sliced almonds and icing sugar.',
      price: 4.20,
      photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
      allergenTags: ['Gluten', 'Nuts', 'Dairy', 'Eggs'],
      dietaryTags: ['Vegetarian'],
      isAvailable: true,
      preparationStationId: 'st-05',
      modifiers: [
        {
          id: 'mod-09',
          name: 'Serving Prep',
          minSelect: 1,
          maxSelect: 1,
          options: [
            { id: 'opt-17', name: 'Warmed Up in Oven', price: 0 },
            { id: 'opt-18', name: 'Served Freshly Cold', price: 0 }
          ]
        }
      ]
    },
    {
      id: 'item-07',
      categoryId: 'cat-07',
      tenantId: 't-02',
      name: 'Avocado Sourdough Toast & Poached Egg',
      description: 'Crushed ripe avocados with fresh lime, red pepper flakes, micro-greens, and two organic soft-poached eggs on toasted house-made sourdough bread.',
      price: 6.50,
      photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
      allergenTags: ['Gluten', 'Eggs'],
      dietaryTags: ['Vegetarian', 'Healthy Option'],
      isAvailable: true,
      preparationStationId: 'st-06',
      modifiers: [
        {
          id: 'mod-10',
          name: 'Extra Topping',
          minSelect: 0,
          maxSelect: 2,
          options: [
            { id: 'opt-19', name: 'Add Smoked Salmon', price: 2.50 },
            { id: 'opt-20', name: 'Add Extra Poached Egg', price: 0.70 },
            { id: 'opt-21', name: 'Add Sautéed Mushrooms', price: 1.00 }
          ]
        }
      ]
    }
  ]
};

export const mockTables: Table[] = [
  // Aisha's Bole Road branch tables
  { id: 'tab-01', branchId: 'b-01', number: 'Table 1', section: 'Indoor', status: 'eating', qrUrl: 'https://menuflow.io/aishas-kitchen/b-01/tab-01' },
  { id: 'tab-02', branchId: 'b-01', number: 'Table 2', section: 'Indoor', status: 'waiting', qrUrl: 'https://menuflow.io/aishas-kitchen/b-01/tab-02' },
  { id: 'tab-03', branchId: 'b-01', number: 'Table 3', section: 'Outdoor', status: 'empty', qrUrl: 'https://menuflow.io/aishas-kitchen/b-01/tab-03' },
  { id: 'tab-04', branchId: 'b-01', number: 'Table 4', section: 'Terrace', status: 'empty', qrUrl: 'https://menuflow.io/aishas-kitchen/b-01/tab-04' },
  
  // Carlos's Westlands branch tables
  { id: 'tab-05', branchId: 'b-03', number: 'Bar Seat 1', section: 'Indoor', status: 'eating', qrUrl: 'https://menuflow.io/carlos-espresso/b-03/tab-05' },
  { id: 'tab-06', branchId: 'b-03', number: 'Patio Table 1', section: 'Outdoor', status: 'empty', qrUrl: 'https://menuflow.io/carlos-espresso/b-03/tab-06' }
];

export const mockStaff: Staff[] = [
  { id: 's-01', name: 'Aisha Jafar', email: 'aisha@menuflow.com', role: 'owner', tenantId: 't-01', branchId: 'b-01', active: true },
  { id: 's-02', name: 'Carlos Mwangi', email: 'carlos@menuflow.com', role: 'owner', tenantId: 't-02', branchId: 'b-03', active: true },
  { id: 's-03', name: 'Fatima Ahmed', email: 'fatima@menuflow.com', role: 'waiter', tenantId: 't-01', branchId: 'b-01', active: true },
  { id: 's-04', name: 'Yohannes Bekele', email: 'yohannes@menuflow.com', role: 'kitchen', tenantId: 't-01', branchId: 'b-01', stationId: 'st-01', active: true },
  { id: 's-05', name: 'Kebron Abera', email: 'cashier@menuflow.com', role: 'cashier', tenantId: 't-01', branchId: 'b-01', active: true },
  { id: 's-06', name: 'Wanjiku Kamau', email: 'wanjiku@menuflow.com', role: 'waiter', tenantId: 't-02', branchId: 'b-03', active: true },
  { id: 's-07', name: 'Chef Samuel', email: 'samuel@menuflow.com', role: 'kitchen', tenantId: 't-02', branchId: 'b-03', stationId: 'st-04', active: true }
];

export const mockOrders: Order[] = [
  {
    id: 'ord-01',
    orderNum: 'MF-3011',
    tenantId: 't-01',
    branchId: 'b-01',
    tableId: 'tab-01',
    type: 'dine_in',
    customerName: 'Maya Kebede',
    customerPhone: '+251911445566',
    items: [
      {
        id: 'oi-01',
        menuItemId: 'item-01',
        name: 'Beyaynetu (Veggie Platter)',
        price: 360, // base 320 + 40 teff
        quantity: 1,
        selectedModifiers: [
          { groupName: 'Injera Selection', optionName: '100% Pure Teff Injera', price: 40 }
        ],
        status: 'ready',
        assignedStationId: 'st-01'
      },
      {
        id: 'oi-02',
        menuItemId: 'item-04',
        name: 'Traditional Ethiopian Coffee Ceremony',
        price: 130, // base 120 + 10 spice
        quantity: 1,
        selectedModifiers: [
          { groupName: 'Sweetener', optionName: 'With Sugar', price: 0 },
          { groupName: 'Sweetener', optionName: 'With Cardamom Spice', price: 10 }
        ],
        status: 'delivered',
        assignedStationId: 'st-03'
      }
    ],
    status: 'cooking',
    paymentStatus: 'unpaid',
    discount: 0,
    tax: 73.5, // 15% of 490 subtotal
    serviceCharge: 24.5, // 5% of 490 subtotal
    subtotal: 490,
    total: 588,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
    notes: 'Coffee with extra popcorn please'
  },
  {
    id: 'ord-02',
    orderNum: 'MF-3012',
    tenantId: 't-01',
    branchId: 'b-01',
    tableId: 'tab-02',
    type: 'dine_in',
    customerName: 'Dawit Hailu',
    customerPhone: '+251912556677',
    items: [
      {
        id: 'oi-03',
        menuItemId: 'item-03',
        name: 'Shekla Tibs',
        price: 490,
        quantity: 2,
        selectedModifiers: [
          { groupName: 'Spice Preference', optionName: 'Regular Traditional Spiced', price: 0 }
        ],
        status: 'cooking',
        assignedStationId: 'st-02'
      }
    ],
    status: 'submitted',
    paymentStatus: 'unpaid',
    discount: 0,
    tax: 147, // 15% of 980
    serviceCharge: 49, // 5% of 980
    subtotal: 980,
    total: 1176,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 mins ago
    notes: 'Please bring hot chili sauce (Mitmitta) on the side.'
  },
  {
    id: 'ord-03',
    orderNum: 'MF-3009',
    tenantId: 't-01',
    branchId: 'b-01',
    tableId: 'tab-03',
    type: 'dine_in',
    customerName: 'Sami & Helina',
    items: [
      {
        id: 'oi-04',
        menuItemId: 'item-02',
        name: 'Doro Wat (Royal Chicken Stew)',
        price: 510, // base 480 + 30 extra egg
        quantity: 1,
        selectedModifiers: [
          { groupName: 'Injera Choice', optionName: 'Standard Injera', price: 0 },
          { groupName: 'Extra Egg', optionName: 'One Additional Boiled Egg', price: 30 }
        ],
        status: 'delivered',
        assignedStationId: 'st-01'
      }
    ],
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'mobile_money',
    discount: 50, // Promo discount
    tax: 76.5,
    serviceCharge: 25.5,
    subtotal: 510,
    total: 562,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
    rating: 5,
    feedback: 'Amazing traditional flavors. Best Doro Wat in Bole!'
  },
  {
    id: 'ord-04',
    orderNum: 'MF-4091',
    tenantId: 't-02',
    branchId: 'b-03',
    tableId: 'tab-05',
    type: 'dine_in',
    customerName: 'Sarah Kamau',
    items: [
      {
        id: 'oi-05',
        menuItemId: 'item-05',
        name: 'Single-Origin Flat White',
        price: 4.60, // 3.80 + 0.80 oat milk
        quantity: 1,
        selectedModifiers: [
          { groupName: 'Milk Choice', optionName: 'Artisanal Oat Milk', price: 0.80 }
        ],
        status: 'ready',
        assignedStationId: 'st-04'
      },
      {
        id: 'oi-06',
        menuItemId: 'item-06',
        name: 'Freshly Baked Almond Croissant',
        price: 4.20,
        quantity: 1,
        selectedModifiers: [
          { groupName: 'Serving Prep', optionName: 'Warmed Up in Oven', price: 0 }
        ],
        status: 'ready',
        assignedStationId: 'st-05'
      }
    ],
    status: 'ready',
    paymentStatus: 'unpaid',
    discount: 0,
    tax: 1.41, // 16% of 8.80
    serviceCharge: 0,
    subtotal: 8.80,
    total: 10.21,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    notes: ''
  }
];

export const mockSystemLogs: SystemLog[] = [
  { id: 'log-01', userEmail: 'aisha@menuflow.com', role: 'owner', action: 'Update Menu', timestamp: '2026-07-05T10:00:00Z', details: 'Added 100% Pure Teff option to Beyaynetu' },
  { id: 'log-02', userEmail: 'fatima@menuflow.com', role: 'waiter', action: 'Place Order', timestamp: '2026-07-05T11:15:00Z', details: 'Placed order MF-3011 for Table 1' },
  { id: 'log-03', userEmail: 'yohannes@menuflow.com', role: 'kitchen', action: 'Update Item Status', timestamp: '2026-07-05T11:40:00Z', details: 'Marked Beyaynetu as READY for order MF-3011' }
];

export const mockGlobalStats: PlatformStats = {
  totalTenants: 124,
  activeTenants: 112,
  totalOrders: 43210,
  totalRevenue: 28450000, // ETB/KES converted
  monthlyGrowthRate: 18.5
};
