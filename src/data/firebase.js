import { initializeApp } from "firebase/app";
import { 
    collection, 
    doc, 
    getDocs, 
    getFirestore, 
    getDoc, 
    query, 
    where, 
    addDoc, 
    setDoc 
} from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import { getAuth } from "firebase/auth"; 
import productosData from "./productos.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

// Exportación de instancias para usar en el resto de la App
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// --- FUNCIONES DE PRODUCTOS ---

export async function getProductos() {
    const productosRef = collection(db, "products");
    const productosSnapshot = await getDocs(productosRef);
    const productosList = productosSnapshot.docs.map(doc => {
        return {
            id: doc.id, ...doc.data()
        }
    });
    return productosList;
}

export async function getProductoById(id) {
    const productosRef = doc(db, "products", id);
    const productosSnapshot = await getDoc(productosRef);
    return { id: productosSnapshot.id, ...productosSnapshot.data() };
}    

export async function getProductosByCategory(categParam) {
    const productosRef = collection(db, "products");
    const q = query(productosRef, where("categoria", "==", categParam));
    const productosSnapshot = await getDocs(q);
    const productosList = productosSnapshot.docs.map(doc => {
        return {
            id: doc.id, ...doc.data()
        }
    });
    return productosList;
}

// --- FUNCIONES DE ÓRDENES ---

export async function createOrder(orderData) {
    const ordersRef = collection(db, "orders");
    const newOrderRef = await addDoc(ordersRef, orderData);
    return newOrderRef;
}

// --- SCRIPT DE MIGRACIÓN (Sincronizar local a Firebase) ---

export async function subirProductos({ forceUpdate = false } = {}) {
  const productsRef = collection(db, "products");

  for (const producto of productosData) {
    try {
      const q = query(productsRef, where("nombre", "==", producto.nombre));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        console.log(`Skipped: producto existente "${producto.nombre}"`);
        if (forceUpdate) {
          const existingRef = snapshot.docs[0].ref;
          await setDoc(existingRef, producto, { merge: true });
          console.log(`Updated producto existente: "${producto.nombre}"`);
        }
        continue; 
      }

      const newDoc = await addDoc(productsRef, producto);
      console.log("Producto agregado con ID: ", newDoc.id);
    } catch (err) {
      console.error("Error subiendo producto", producto?.nombre, err);
    }
  }
}

export default app;