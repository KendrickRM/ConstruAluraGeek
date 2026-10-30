const API_URL = "http://localhost:3001/productos";
const STORAGE_KEY = "construalurageek-productos";

// En local se usa json-server; si no está disponible (p. ej. GitHub Pages)
// se leen los datos de db.json y los cambios se guardan en el navegador.
const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
let useApi = isLocal;

const readStore = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
};

const writeStore = (products) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error(error);
    }
};

const getStaticProducts = async () => {
    const stored = readStore();
    if (stored) return stored;

    const res = await fetch("db.json");
    if (!res.ok) throw new Error(`Error ${res.status} al leer db.json`);
    const { productos } = await res.json();
    writeStore(productos);
    return productos;
};

export const getProducts = async () =>{
    if (useApi) {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error(`Error ${res.status} al obtener productos`);
            return await res.json();
        } catch (error) {
            console.warn("API no disponible, usando db.json", error);
            useApi = false;
        }
    }

    try {
        return await getStaticProducts();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const deleteProduct = async(id)=>{
    if (useApi) {
        try {
            const res = await fetch(`${API_URL}/${id}`,{
                method: "DELETE"
            });
            if (!res.ok) throw new Error(`Error ${res.status} al eliminar el producto`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    try {
        const products = await getStaticProducts();
        writeStore(products.filter((product) => String(product.id) !== String(id)));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const createProduct = async(body)=>{
    if (useApi) {
        try {
            const res = await fetch(API_URL,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:body
            });
            if (!res.ok) throw new Error(`Error ${res.status} al crear el producto`);
            return await res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    try {
        const products = await getStaticProducts();
        const product = { id: Date.now().toString(36), ...JSON.parse(body) };
        writeStore([...products, product]);
        return product;
    } catch (error) {
        console.error(error);
        return null;
    }
}
