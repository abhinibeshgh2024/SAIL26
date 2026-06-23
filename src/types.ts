export interface User {
  email: string;
  fullName: string;
  department: string;
  role: 'Admin' | 'Staff' | 'Chief Engineer';
  createdAt: string;
}

export interface SteelItem {
  itemId: string;           // e.g. SAIL-HR-203
  itemName: string;         // e.g. Hot Rolled Coil - 2.5mm
  annualQuantity: number;   // Expected annual consumption (in metric tons or pieces)
  neededAverageQuantity: number; // Safety/Average buffer quantity needed on hand
  companyName: string;      // Supplier or manufacturer name (e.g. SAIL-Bokaro Steel Plant)
  leftoverStock: number;    // Current actual stock in store
  category: string;         // Plate, Coil, Rebar, Beam, Rod, etc.
  createdAt: string;
  lastIssuedDate?: string;
  lastOrderedDate?: string;
}

export interface RefillOrder {
  orderId: string;
  itemId: string;
  itemName: string;
  orderDate: string;
  receivingDate: string;
  receivedQuantity: number;
  receiptImages: string[];  // Data URL base64 images as proof
  supplierName: string;
  createdAt: string;
}

export interface IssueSales {
  issueId: string;
  itemId: string;
  itemName: string;
  buyerFirm: string;        // The buying firm or company
  issuedQuantity: number;   // Sold / issued quantity
  unitPrice: number;        // Price per unit (e.g., INR per metric ton)
  totalAmount: number;      // issuedQuantity * unitPrice
  issueDate: string;
  issuedByName: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  runningOutFaster: { itemId: string; itemName: string; issueCount: number; totalIssued: number }[];
  stagnantProducts: { itemId: string; itemName: string; lastActivityDays: number; leftoverStock: number }[];
  largePurchases: { itemId: string; itemName: string; refillCount: number; totalReceived: number }[];
}
