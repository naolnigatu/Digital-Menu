const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const replacement = `const deleteFromFirestore = async (collectionName: string, docId: string) => {`;
const fetchOrderCode = `
  const fetchOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      const { getDB } = await import('../lib/firebase');
      const db = getDB();
      if (!db) return null;
      const { doc, getDoc } = await import('firebase/firestore');
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Order;
      }
      return null;
    } catch (err) {
      console.warn("fetchOrderById error:", err);
      return null;
    }
  };

  const deleteFromFirestore`;

code = code.replace(replacement, fetchOrderCode);

// Also add to AppContext interface
const interfaceReplace = `fetchOrderById: (id: string) => Promise<Order | null>;
  deleteFromFirestore`;
code = code.replace(/deleteFromFirestore: \(collectionName: string, docId: string\) => Promise<void>;/, interfaceReplace);

// Also add to return object
code = code.replace(/deleteFromFirestore,\n\s*registerUser/, "fetchOrderById,\n    deleteFromFirestore,\n    registerUser");

fs.writeFileSync('src/context/AppContext.tsx', code);
