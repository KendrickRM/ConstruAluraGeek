import { createProduct } from "./CRUD.js";
import AllProducts from "./AllProducts.js";

const IMAGE_TIMEOUT_MS = 8000;

const validateNombre = (value) => {
    const nombre = value.trim();
    if (!nombre) return "Escribe el nombre del producto.";
    if (/\d/.test(nombre)) return "El nombre no puede contener números.";
    return "";
};

const validatePrecio = (value) => {
    const precio = value.trim();
    if (!precio) return "Escribe un precio, por ejemplo 5.200.";
    if (/-\s*\d/.test(precio)) return "El precio no puede ser negativo.";
    if (!/\d/.test(precio)) return "El precio debe incluir al menos un número.";
    return "";
};

// Comprueba que sea una URL http(s) y que realmente cargue como imagen
const validateImagen = (value) => new Promise((resolve) => {
    const url = value.trim();
    if (!url) return resolve("Pega la URL de la imagen.");

    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        return resolve("Pega una URL válida que empiece con https://");
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
        return resolve("La URL debe empezar con http:// o https://");
    }

    const img = new Image();
    const timer = setTimeout(() => finish("No se pudo cargar la imagen (tardó demasiado)."), IMAGE_TIMEOUT_MS);
    const finish = (message) => {
        clearTimeout(timer);
        img.onload = img.onerror = null;
        resolve(message);
    };
    img.onload = () => finish("");
    img.onerror = () => finish("La URL no es una imagen válida o no se puede cargar.");
    img.src = url;
});

export default{
    excecute(){
        const form = document.querySelector("#formulario-producto");
        const limpiarButton = document.querySelector("#boton-limpiar");
        const enviarButton = document.querySelector("#boton-enviar");

        const fields = {
            nombre: { input: form.nombre, message: form.querySelector(".parrafo-nombre"), validate: validateNombre },
            precio: { input: form.precio, message: form.querySelector(".parrafo-precio"), validate: validatePrecio },
            imagen: { input: form.imagen, message: form.querySelector(".parrafo-url"), validate: validateImagen },
        };

        const showError = (field, error) => {
            field.message.textContent = error;
            field.input.setAttribute("aria-invalid", error ? "true" : "false");
        };

        // Si el valor cambió mientras se validaba, se descarta el resultado viejo
        const check = async (field) => {
            const value = field.input.value;
            const error = await field.validate(value);
            if (value !== field.input.value) return false;
            showError(field, error);
            return !error;
        };

        // nombre y precio se validan al escribir; la imagen al salir del campo
        ["nombre", "precio"].forEach((name) => {
            fields[name].input.addEventListener("input", () => check(fields[name]));
        });
        fields.imagen.input.addEventListener("input", () => showError(fields.imagen, ""));
        fields.imagen.input.addEventListener("blur", () => {
            if (fields.imagen.input.value.trim()) check(fields.imagen);
        });

        const clearErrors = () => Object.values(fields).forEach((field) => showError(field, ""));

        form.addEventListener("submit", async (e)=>{
            e.preventDefault();

            enviarButton.disabled = true;
            enviarButton.textContent = "Verificando...";

            const results = await Promise.all(Object.values(fields).map(check));

            enviarButton.disabled = false;
            enviarButton.textContent = "Añadir";

            if (!results.every(Boolean)) {
                Object.values(fields).find((field) => field.input.getAttribute("aria-invalid") === "true")?.input.focus();
                return;
            }

            const producto = Object.fromEntries(
                Object.entries(fields).map(([name, field]) => [name, field.input.value.trim()])
            );

            const creado = await createProduct(JSON.stringify(producto));
            if (creado) {
                form.reset();
                clearErrors();
                AllProducts.ShowAllProducts();
            }
        });

        limpiarButton.addEventListener("click", ()=>{
            form.reset();
            clearErrors();
        });
    }
}
