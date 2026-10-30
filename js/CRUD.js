const API_URL = "http://localhost:3001/productos";

export const getProducts = async () =>{
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error ${res.status} al obtener productos`);
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const deleteProduct = async(id)=>{
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

export const createProduct = async(body)=>{
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
