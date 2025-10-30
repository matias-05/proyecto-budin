import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, getDoc, query, where, addDoc } from "firebase/firestore";
import productosData from "./productos.js";
 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getProductos() {
    const productosRef = collection(db, "products")
    const productosSnapshot = await getDocs(productosRef)
    const productosList = productosSnapshot.docs.map(doc => {
        return {
            id: doc.id, ...doc.data()
        }
    });
    return productosList;
}

export async function getProductoById(id) {
    const productosRef = doc(db, "products", id)
    const productosSnapshot = await getDoc(productosRef)
    return {id: productosSnapshot.id, ...productosSnapshot.data()};
}    

export async function getProductosByCategory(categParam) {
    const productosRef = collection(db, "products")
    const q = query(productosRef, where("categoria", "==", categParam));
    const productosSnapshot = await getDocs(q)
    const productosList = productosSnapshot.docs.map(doc => {
        return {
            id: doc.id, ...doc.data()
        }
    });
    return productosList;
}

export async function createOrder(orderData) {
    const ordersRef = collection(db, "orders");
    const newOrderRef = await addDoc(ordersRef, orderData);
    return newOrderRef;
}

export async function subirProductos() {
    for (let producto of productosData) {
        delete producto.id;
        const newDoc = await addDoc(collection(db, "products"), producto);
        console.log("Producto agregado con ID: ", newDoc.id);
    }
}

export default app;