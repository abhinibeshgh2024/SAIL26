import { SteelItem, RefillOrder, IssueSales, User, AnalyticsSummary } from '../types';

// Hardcoded sample image proofs (base64 svg mock to keep it completely self-contained and visually appealing)
const MOCK_BILL_IMAGE_1 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200' style='background:%23f3f4f6;font-family:sans-serif;color:%23374151;'><rect width='380' height='180' x='10' y='10' fill='white' stroke='%23d1d5db' stroke-width='2' rx='5'/><text x='30' y='40' font-size='16' font-weight='bold' fill='%231f2937'>SAIL REFILL RECEIPT PROOF</text><line x1='30' y1='55' x2='370' y2='55' stroke='%233b82f6' stroke-width='2'/><text x='30' y='80' font-size='11'>Order Reference: SAIL-REP-10292</text><text x='30' y='100' font-size='11'>Supplier: SAIL Bhilai Steel Plant (BSP)</text><text x='30' y='120' font-size='11'>Received: 250 MT (TMT Rebars)</text><text x='30' y='140' font-size='11'>Inspector Signature: S. K. Sharma (Superintendent)</text><rect x='30' y='155' width='120' height='20' rx='3' fill='%2310b981'/><text x='45' y='169' font-size='10' fill='white' font-weight='bold'>VERIFIED ISSUE</text></svg>";

const MOCK_BILL_IMAGE_2 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200' style='background:%23f3f4f6;font-family:sans-serif;color:%23374151;'><rect width='380' height='180' x='10' y='10' fill='white' stroke='%23d1d5db' stroke-width='2' rx='5'/><text x='30' y='40' font-size='16' font-weight='bold' fill='%231f2937'>SAIL GATE INWARD LOG</text><line x1='30' y1='55' x2='370' y2='55' stroke='%23eab308' stroke-width='2'/><text x='30' y='80' font-size='11'>Inward Gate Pass: #IN-908</text><text x='30' y='100' font-size='11'>Item: Heavy Plates (SAIL-SP-101)</text><text x='30' y='120' font-size='11'>Carrier: National Logistics Corp</text><text x='30' y='140' font-size='11'>Status: Logged into Store No. 5A</text><rect x='30' y='155' width='90' height='20' rx='3' fill='%236366f1'/><text x='40' y='169' font-size='10' fill='white' font-weight='bold'>SECURED</text></svg>";

const DEFAULT_ITEMS: SteelItem[] = [
  {
    itemId: 'SAIL-HR-301',
    itemName: 'Hot Rolled Steel Structural Plates (IS 2062)',
    annualQuantity: 4500,
    neededAverageQuantity: 400,
    companyName: 'SAIL Bokaro Steel Plant (BSL)',
    leftoverStock: 140, // 35% of neededAverageQuantity (ALERT: running low)
    category: 'Plates',
    createdAt: '2026-01-10T10:00:00Z',
    lastOrderedDate: '2026-05-12',
    lastIssuedDate: '2026-06-20'
  },
  {
    itemId: 'SAIL-TMT-50D',
    itemName: 'TMT High Strength Ribbed Rebars Fe 500D',
    annualQuantity: 8000,
    neededAverageQuantity: 800,
    companyName: 'SAIL Bhilai Steel Plant (BSP)',
    leftoverStock: 320, // 40% of neededAverageQuantity (ALERT: running low)
    category: 'Rebars',
    createdAt: '2026-01-15T11:30:00Z',
    lastOrderedDate: '2026-04-18',
    lastIssuedDate: '2026-06-21'
  }
];

const DEFAULT_ORDERS: RefillOrder[] = [
  {
    orderId: 'ORD-SAIL-021',
    itemId: 'SAIL-TMT-50D',
    itemName: 'TMT High Strength Ribbed Rebars Fe 500D',
    orderDate: '2026-04-10',
    receivingDate: '2026-04-18',
    receivedQuantity: 350,
    receiptImages: [MOCK_BILL_IMAGE_1],
    supplierName: 'SAIL Bhilai Steel Plant (BSP)',
    createdAt: '2026-04-18T12:00:00Z'
  },
  {
    orderId: 'ORD-SAIL-022',
    itemId: 'SAIL-HR-301',
    itemName: 'Hot Rolled Steel Structural Plates (IS 2062)',
    orderDate: '2026-05-05',
    receivingDate: '2026-05-12',
    receivedQuantity: 200,
    receiptImages: [MOCK_BILL_IMAGE_2],
    supplierName: 'SAIL Bokaro Steel Plant (BSL)',
    createdAt: '2026-05-12T14:30:00Z'
  }
];

const DEFAULT_ISSUES: IssueSales[] = [
  {
    issueId: 'ISS-SAIL-781',
    itemId: 'SAIL-TMT-50D',
    itemName: 'TMT High Strength Ribbed Rebars Fe 500D',
    buyerFirm: 'Larsen & Toubro Ltd. (L&T Metro Infra)',
    issuedQuantity: 420,
    unitPrice: 58000,
    totalAmount: 24360000,
    issueDate: '2026-06-21',
    issuedByName: 'Amitabh Mishra',
    createdAt: '2026-06-21T15:00:00Z'
  },
  {
    issueId: 'ISS-SAIL-782',
    itemId: 'SAIL-HR-301',
    itemName: 'Hot Rolled Steel Structural Plates (IS 2062)',
    buyerFirm: 'Hindustan Shipyard Limited (HSL)',
    issuedQuantity: 280,
    unitPrice: 62500,
    totalAmount: 17500000,
    issueDate: '2026-06-20',
    issuedByName: 'Prerna Sen',
    createdAt: '2026-06-20T11:45:00Z'
  }
];

const DEFAULT_USERS: { [email: string]: string & { fullName: string; department: string; role: string } } | any[] = [
  {
    email: 'admin@sail.co.in',
    password: 'password123',
    fullName: 'Shri R. K. Srivastava',
    department: 'Central Blast Furnace Allocation Division',
    role: 'Admin'
  },
  {
    email: 'engineer@sail.co.in',
    password: 'password123',
    fullName: 'Ananya Deshmukh',
    department: 'Quality Inspection & Inventory Section',
    role: 'Chief Engineer'
  }
];

export function initLocalStorageDB() {
  if (typeof window === 'undefined') return;

  // Sane state clear/upgrade: If DB contains more than 2 default items (the previous template load), re-initialize with exactly 2 items.
  const storedItems = localStorage.getItem('sail_items');
  let deservesReset = false;
  if (storedItems) {
    try {
      const parsed = JSON.parse(storedItems);
      if (parsed.length > 2) {
        deservesReset = true;
      }
    } catch (e) {
      deservesReset = true;
    }
  }

  if (deservesReset || !localStorage.getItem('sail_items')) {
    localStorage.setItem('sail_items', JSON.stringify(DEFAULT_ITEMS));
    localStorage.setItem('sail_orders', JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem('sail_issues', JSON.stringify(DEFAULT_ISSUES));
  }
  if (!localStorage.getItem('sail_users')) {
    localStorage.setItem('sail_users', JSON.stringify(DEFAULT_USERS));
  }
}

// ------------------------------------
// Items API
// ------------------------------------
export function getItems(): SteelItem[] {
  initLocalStorageDB();
  const data = localStorage.getItem('sail_items');
  return data ? JSON.parse(data) : [];
}

export function saveItem(item: Omit<SteelItem, 'leftoverStock' | 'createdAt'>): SteelItem {
  const items = getItems();
  
  // Clean duplicate items helper
  const existingIndex = items.findIndex((i) => i.itemId.toUpperCase() === item.itemId.toUpperCase());
  
  const newItem: SteelItem = {
    ...item,
    itemId: item.itemId.toUpperCase(),
    leftoverStock: 0, // initially zero until refilled, or let start with 0
    createdAt: new Date().toISOString()
  };

  if (existingIndex > -1) {
    // preserve old stock
    newItem.leftoverStock = items[existingIndex].leftoverStock;
    items[existingIndex] = newItem;
  } else {
    items.push(newItem);
  }

  localStorage.setItem('sail_items', JSON.stringify(items));
  return newItem;
}

// Adjust item leftover stock
export function adjustItemStock(itemId: string, quantityDiff: number, isOrder: boolean) {
  const items = getItems();
  const updated = items.map((item) => {
    if (item.itemId.toUpperCase() === itemId.toUpperCase()) {
      const updatedStock = Math.max(0, item.leftoverStock + quantityDiff);
      return {
        ...item,
        leftoverStock: updatedStock,
        ...(isOrder 
          ? { lastOrderedDate: new Date().toISOString().split('T')[0] } 
          : { lastIssuedDate: new Date().toISOString().split('T')[0] }
        )
      };
    }
    return item;
  });
  localStorage.setItem('sail_items', JSON.stringify(updated));
}

// ------------------------------------
// Orders / Refills API
// ------------------------------------
export function getOrders(): RefillOrder[] {
  initLocalStorageDB();
  const data = localStorage.getItem('sail_orders');
  return data ? JSON.parse(data) : [];
}

export function addOrder(order: Omit<RefillOrder, 'orderId' | 'createdAt'>): RefillOrder {
  const orders = getOrders();
  const orderId = `ORD-SAIL-${String(orders.length + 101).padStart(3, '0')}`;
  
  const newOrder: RefillOrder = {
    ...order,
    orderId,
    createdAt: new Date().toISOString()
  };
  
  orders.unshift(newOrder); // Add to beginning
  localStorage.setItem('sail_orders', JSON.stringify(orders));
  
  // Update leftover stock in items list
  adjustItemStock(order.itemId, order.receivedQuantity, true);
  
  return newOrder;
}

// ------------------------------------
// Issues / Selling API
// ------------------------------------
export function getIssues(): IssueSales[] {
  initLocalStorageDB();
  const data = localStorage.getItem('sail_issues');
  return data ? JSON.parse(data) : [];
}

export function addIssue(issue: Omit<IssueSales, 'issueId' | 'totalAmount' | 'createdAt'>): IssueSales {
  const issues = getIssues();
  const issueId = `ISS-SAIL-${String(issues.length + 801).padStart(3, '0')}`;
  
  const totalAmount = issue.issuedQuantity * issue.unitPrice;
  const newIssue: IssueSales = {
    ...issue,
    issueId,
    totalAmount,
    createdAt: new Date().toISOString()
  };
  
  issues.unshift(newIssue);
  localStorage.setItem('sail_issues', JSON.stringify(issues));
  
  // Subtract leftover stock in items list (since items are leaving store)
  adjustItemStock(issue.itemId, -issue.issuedQuantity, false);
  
  return newIssue;
}

// ------------------------------------
// Authentication API
// ------------------------------------
export function getUsers(): User[] {
  initLocalStorageDB();
  const data = localStorage.getItem('sail_users');
  return data ? JSON.parse(data) : [];
}

export function registerUser(email: string, fullName: string, department: string, role: string, password123: string): User | string {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  
  if (users.some((u: any) => u.email.toLowerCase() === normalizedEmail)) {
    return "User account already exists with this email.";
  }
  
  const newUser = {
    email: normalizedEmail,
    fullName,
    department,
    role: role as any,
    password: password123,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('sail_users', JSON.stringify(users));
  
  // Log them in immediately
  setCurrentUser({
    email: newUser.email,
    fullName: newUser.fullName,
    department: newUser.department,
    role: newUser.role as any,
    createdAt: newUser.createdAt
  });
  
  return {
    email: newUser.email,
    fullName: newUser.fullName,
    department: newUser.department,
    role: newUser.role as any,
    createdAt: newUser.createdAt
  };
}

export function loginUser(email: string, password123: string): User | string {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  
  const found = users.find((u: any) => u.email.toLowerCase() === normalizedEmail && u.password === password123);
  if (!found) {
    return "Invalid email credentials or incorrect password. Please try again.";
  }
  
  const loggedUser: User = {
    email: found.email,
    fullName: found.fullName,
    department: found.department,
    role: found.role as any,
    createdAt: found.createdAt || new Date().toISOString()
  };
  
  setCurrentUser(loggedUser);
  return loggedUser;
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('sail_current_user');
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('sail_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('sail_current_user');
  }
}

export function logout() {
  setCurrentUser(null);
}

// ------------------------------------
// Analytics and Intelligence queries
// ------------------------------------
export function getAnalytics(): AnalyticsSummary {
  const items = getItems();
  const issues = getIssues();
  const orders = getOrders();

  // 1. Running out faster: items with highest issued quantity or frequency of issues
  // Let's summarize total issued quantity per item, or issue check frequency
  const issueSummaries: { [key: string]: { name: string; total: number; count: number } } = {};
  items.forEach(i => {
    issueSummaries[i.itemId] = { name: i.itemName, total: 0, count: 0 };
  });
  issues.forEach(is => {
    if (issueSummaries[is.itemId]) {
      issueSummaries[is.itemId].total += is.issuedQuantity;
      issueSummaries[is.itemId].count += 1;
    } else {
      issueSummaries[is.itemId] = { name: is.itemName, total: is.issuedQuantity, count: 1 };
    }
  });
  const runningOutFaster = Object.entries(issueSummaries)
    .map(([itemId, val]) => ({
      itemId,
      itemName: val.name,
      issueCount: val.count,
      totalIssued: val.total
    }))
    .sort((a, b) => b.totalIssued - a.totalIssued);

  // 2. Not in selling for long (stagnant): items with oldest issue date, or no issues at all
  // Let's check status against current date
  const stagnantProducts = items.map(item => {
    let lastActivityDays = 999; // Default if never sold
    if (item.lastIssuedDate) {
      const lastDate = new Date(item.lastIssuedDate);
      const today = new Date('2026-06-23'); // Local time environment constant
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      lastActivityDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return {
      itemId: item.itemId,
      itemName: item.itemName,
      lastActivityDays,
      leftoverStock: item.leftoverStock
    };
  }).sort((a, b) => b.lastActivityDays - a.lastActivityDays); // Longest since sale first

  // 3. Purchased in large amount (biggest refills)
  const orderSummaries: { [key: string]: { name: string; total: number; count: number } } = {};
  items.forEach(i => {
    orderSummaries[i.itemId] = { name: i.itemName, total: 0, count: 0 };
  });
  orders.forEach(ord => {
    if (orderSummaries[ord.itemId]) {
      orderSummaries[ord.itemId].total += ord.receivedQuantity;
      orderSummaries[ord.itemId].count += 1;
    } else {
      orderSummaries[ord.itemId] = { name: ord.itemName, total: ord.receivedQuantity, count: 1 };
    }
  });
  const largePurchases = Object.entries(orderSummaries)
    .map(([itemId, val]) => ({
      itemId,
      itemName: val.name,
      refillCount: val.count,
      totalReceived: val.total
    }))
    .sort((a, b) => b.totalReceived - a.totalReceived);

  return {
    runningOutFaster,
    stagnantProducts,
    largePurchases
  };
}
