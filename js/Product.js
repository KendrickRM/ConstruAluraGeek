import { getProducts } from "./CRUD.js"

const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const CardsProducts = async () =>{

    const products = await getProducts();

    return products.map((product)=>`
                <div class="card">
                    <figure>
                        <img class="producto-img" src="${escapeHTML(product.imagen)}" alt="${escapeHTML(product.nombre)}"/>
                        <figcaption class="card-container--info">${escapeHTML(product.nombre)}</figcaption>
                    </figure>
                    <div class="card-container--value">
                        <p>COP/${escapeHTML(product.precio)} </p>
                        <button class="delete-button" data-id="${escapeHTML(product.id)}">
                        <img class="delete_logo"  src="imagenes/eliminar.png" alt="eliminar"/>
                        </button>
                    </div>
                </div>
            `).join("");
}
