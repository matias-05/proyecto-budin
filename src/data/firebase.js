import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, getDoc, query, where, addDoc } from "firebase/firestore";
import productosData from "./productos.js";
 
const firebaseConfig = {
  apiKey: "AIzaSyAIcJJvGTRHdKQGxnxABkp6VLQbzxRpIqs",
  authDomain: "rincon-del-budin.firebaseapp.com",
  projectId: "rincon-del-budin",
  storageBucket: "rincon-del-budin.firebasestorage.app",
  messagingSenderId: "480238539923",
  appId: "1:480238539923:web:29b770355118ceba78e966"
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