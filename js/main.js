//CREO ARRAY DE CARRITO
let carrito = [];

//ASIGNO TIPO DE MONEDA (SOLES PERUANOS)
const TIPO_MONEDA = "s/";

//CAPTURO ID DE TARJETAS
const verCarrito = document.getElementById ("verCarrito");
const contenidoCarrito = document.getElementById ("contenidoCarrito");
const numerito = document.querySelector("#numerito");

// CREANDO EVENTO PARA VER EL CARRITO
verCarrito.addEventListener("click", () =>{    
    generarContenidoCarrito();
    guardarEnStorage();
    });

//FUNCION PARA GENERAR EL CONTENIDO DEL CARRITO
const generarContenidoCarrito =() =>{
contenidoCarrito.innerHTML = "";
//GENERAR LA SECCION DEL CARRITO UNA SOLA VEZ
let seccionCarrito = document.createElement("section");
seccionCarrito.id = "portada_carrito";
seccionCarrito.innerHTML = `
    <div class="row">
    <div class="col-12 padding">
    <h1 class="display-3 fw-bold text-center hero-title">La Baca del Huerto</h1>
    </div>
    <div class="col-12 padding">
    <h2 class="display-3 fw-bold text-center hero-title">Carrito</h2>
    </div>
    </div>
    `;
contenidoCarrito.appendChild(seccionCarrito);
    carrito.forEach((tabla) =>{
        let contenido_carrito = document.createElement ("div");
        contenido_carrito.className = "container mt-5 table-responsive";
        contenido_carrito.innerHTML = `
        <table class="table">
        <thead>
        <tr class="text-white border-bottom-none">
        <th scope="col"></th>
        <th scope="col">Producto</th>
        <th scope="col">Precio</th>
        <th scope="col text-center">Cantidad</th>
        <th scope="col">Eliminar</th>
        <th scope="col">Subtotal</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td class="align-middle">
        <img src="${tabla.imagen}" alt="Producto">
        </td>
        <td data-titulo = "Producto" class="align-middle">${tabla.nombre}</td>
        <td data-titulo = "Precio" class="align-middle">
        ${TIPO_MONEDA}
        ${tabla.precio}
        </td>
        <td data-titulo = "Cantidad">
        <div class="d-flex">
        <button class="btn btn-outline-secondary mt-auto mb-auto" id="botonRestar">-</button>
        <p class="ms-3 me-3 m-auto">${tabla.cantidad}</p>
        <button class="btn btn-outline-secondary mt-auto mb-auto" id="botonAgregar${tabla.id}">+</button>
        </div>
        </td>
        <td data-titulo = "Eliminar">
        <button onclick= "eliminarCarrito (${tabla.id})" class="btn rounded-pill mb-2 ps-4 align-middle">
        <img class="imagen_carrito" src="./imagenes/boton_eliminar.png" alt="">
        </button>
        </td>
        <td data-titulo = "Subtotal" class="ps-4 align-middle">
        ${tabla.total}
        <span class="d-none">0</span>
        </td>
        </tr>
        </tbody>
        </table>
        `;
        contenidoCarrito.append(contenido_carrito);
        
        //CREANDO EVENTOS PARA BOTONES + - 
        const botonRestar = contenido_carrito.querySelector("#botonRestar");
        const botonAgregar = contenido_carrito.querySelector("#botonAgregar" + tabla.id);
    
        botonRestar.addEventListener("click", () => restarCantidad(tabla.id));
        botonAgregar.addEventListener("click", () => sumarCantidad(tabla.id));
    });
    actualizarNumerito();
    
    //FUNCION PARA BOTONES + - 
    function restarCantidad(prodId) {
        const producto = carrito.find((tabla) => tabla.id === prodId);
        if (producto.cantidad > 1) {
            producto.cantidad--;
            producto.total = producto.precio * producto.cantidad;
            generarContenidoCarrito();
            guardarEnStorage();
        }
    }
    function sumarCantidad(prodId) {
        const producto = carrito.find((tabla) => tabla.id === prodId);
        producto.cantidad++;
        producto.total = producto.precio * producto.cantidad;
        generarContenidoCarrito();
        guardarEnStorage();
    }
    
    //FUNCION PARA CALCULAR EL TOTAL DE LA COMPRA
    const totalCompra = carrito.reduce((a, b) => a +b.total, 0);
    const totalPagar = document.createElement ("div");
    totalPagar.className = ("container");
    totalPagar.innerHTML = `
    <hr class="w-25 ms-auto mt-5 hr-style">
    <hr class="w-25 ms-auto border-bottom border-5 bg-dark mt-4 hr-style">
    <div class="payment-checkout w-100">
    <div class="d-flex justify-content-end fw-bold">
    <p class="d-inline me-5">Total:</p>
    <span>
    ${TIPO_MONEDA}
    ${totalCompra}
    </span>
    </div>
    </div>
    <button class="card-button btn btn-secondary text-white fw-bold d-block ms-auto me-4" id="botonPagar">Pagar</button>
    <div class="mb-4">
    <a href="./index.html" class="text-decoration-none text-dark mt-5">
    <img class="flecha_atras_carrito" src="./imagenes/flecha-atras.png" alt="">
    <span class="fw-bold font">Continuar comprando</span>
    </a>
    </div>
    </div>
    `;
    contenidoCarrito.append(totalPagar);
    
    //CREANDO EVENTO PARA VER LAS ALERTAS DEL BOTON AÑADIR
    botonPagar.addEventListener("click", () => {
        alertaComprar();
    });
    
    // GUARDAR CAMBIOS EN EL LOCAL STORAGE
    actualizarCarrito();
}

//FUNCION PARA ELIMINAR PRODUCTOS DEL CARRITO
const eliminarCarrito = (prodId) => {
    const item = carrito.find((tabla) => tabla.id === prodId);
    const indice = carrito.indexOf(item);
    alertaEliminarProducto(item, indice);
}

//FUNCION PARA GUARDAR EL CARRITO EN EL LOCAL STORAGE
function guardarEnStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// FUNCION PARA CARGAR EL CARRITO DESDE EL LOCAL STORAGE
window.addEventListener("load", () => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    actualizarNumerito();
    actualizarCarrito();
});

//FUNCION PARA TENER EL CARRITO
function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//FUNCION PARA ACTUALIZAR EL NUMERITO DEL CARRITO
function actualizarNumerito() {
    let nuevoNumerito = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}
//CREANDO EVENTO PARA CONTRAER EL NAVBAR CUANDO HACEN CLICK EN EL CARRITO
document.addEventListener('DOMContentLoaded', function() {
    var verCarrito = document.getElementById('verCarrito');
    var navbarCollapse = document.getElementById('navbarSupportedContent');

    verCarrito.addEventListener('click', function() {
        navbarCollapse.classList.remove('show');
    });
});

//ALERTAS
//FUNCION PARA ALERTA DE BOTON AÑADIR
const alertaAnadirAlCarrito = (tabla) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    Toast.fire({
        icon: 'success',
        iconColor: '#a89c8bc4',
        title: `Se añadió ${tabla.nombre} al carrito`
    });
}

//FUNCION PARA ALERTA ELIMINAR PRODUCTO
const alertaEliminarProducto = (item, indice,) => {
    Swal.fire({
        title: 'Eliminar Producto',
        text: `Está seguro que desea eliminar el producto ${item.nombre} del carrito?`,
        icon: 'warning',
        iconColor: '#a89c8bc4',
        showCancelButton: true,
        confirmButtonColor: '#795F3A',
        cancelButtonColor: ' #AA9D8C',
        confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.splice(indice, 1);
                generarContenidoCarrito();
                guardarEnStorage(); 
                }
            })  
}

//FUNCION PARA ALERTA BOTON COMPRAR
const alertaComprar = () => {
    Swal.fire({
        title: 'Desea confirmar su compra?',
        icon: 'warning',
        iconColor: '#a89c8bc4',
        showCancelButton: true,
        confirmButtonColor: '#AA9D8C',
        cancelButtonColor: '#795F3A',
        confirmButtonText: 'Si, pagar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Gracias por su compra!',
                'Lo esperamos pronto!'
                )
                carrito.splice(0, carrito.length); 
                generarContenidoCarrito(); 
                guardarEnStorage(); 
            }
        })
}




