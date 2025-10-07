import productos from './productos.js';

export default function getProductos() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(productos), 1000);
    });
}

export function getProductoById(id) {
    return new Promise((resolve, reject) => {
        const producto = productos.find(p => p.id === Number(id));
        setTimeout(() => {
            if (producto) {
                resolve(producto);
            } else {
                reject(new Error('Producto no encontrado'));
            }
        }, 1000);
    });
}

export function getProductosByCategory(categParam) {
    return new Promise((resolve, reject) => {
        const producto = productos.filter(p => p.categoria === categParam);
        setTimeout(() => {
            if (producto) {
                resolve(producto);
            } else {
                reject(new Error('Producto no encontrado'));
            }
        }, 1000);
    });
}