import productos from './productos.js';

export default function getProductos() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(productos), 1000);
    });
}