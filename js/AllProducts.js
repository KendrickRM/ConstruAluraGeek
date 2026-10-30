import { CardsProducts } from "./Product.js";
import { deleteProduct } from "./CRUD.js";

const contenedor = document.querySelector("#lista-card");

const render = async () => {
    contenedor.innerHTML = await CardsProducts();
};

// Delegación de eventos: funciona aunque el clic sea sobre la imagen dentro del botón
contenedor.addEventListener("click", async (e) => {
    const button = e.target.closest(".delete-button");
    if (!button) return;

    const eliminado = await deleteProduct(button.dataset.id);
    if (eliminado) render();
});

export default{

    ShowAllProducts (){
        return render();
    }

}
