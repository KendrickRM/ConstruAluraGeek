import { createProduct } from "./CRUD.js";
import AllProducts from "./AllProducts.js";

export default{
    excecute(){
        const form = document.querySelector("#formulario-producto");
        const limpiarButton = document.querySelector("#boton-limpiar");

        form.addEventListener("submit", async (e)=>{
            e.preventDefault();
            const producto = Object.fromEntries(new FormData(form).entries());

            const creado = await createProduct(JSON.stringify(producto));
            if (creado) {
                form.reset();
                AllProducts.ShowAllProducts();
            }
        });

        limpiarButton.addEventListener("click", ()=>{
            form.reset();
        });
    }
}
