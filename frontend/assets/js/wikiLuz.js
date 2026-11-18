
"use strict";

//--------- VARIABLES Y REFERENCIAS ---------//

const cuadro1 = document.querySelector(".luz_cuadro_1 .card-content-inner");
const cuadro2 = document.querySelector(".luz_cuadro_2 .card-content-inner");
const cuadro3 = document.querySelector(".luz_cuadro_3 .card-content-inner");

const botonesLuz = document.querySelectorAll(".luz-sidebar .luz-btn");

const rutaImagenes = "../assets/images/";


//--------- FUNCIONES GENERALES ---------//

// Limpiar los tres cuadros.
function limpiarCuadros() {
    cuadro1.replaceChildren();
    cuadro2.replaceChildren();
    cuadro3.replaceChildren();
}

// Agregar texto a un cuadro.
function agregarTexto(contenedor, texto) {
    const parrafo = document.createElement("p");
    parrafo.textContent = texto;
    contenedor.appendChild(parrafo);
}

// Agregar una imagen a un cuadro.
function agregarImagen(contenedor, archivo, descripcion) {

    if (!archivo) {
        return;
    }

    const imagen = document.createElement("img");

    colocarImagen(imagen, archivo, descripcion);

    imagen.style.maxWidth = "100%";
    imagen.style.height = "auto";
    imagen.style.display = "block";

    contenedor.appendChild(imagen);
}

// Colocar una imagen y su descripción.
function colocarImagen(elemento, archivo, descripcion) {

    elemento.alt = descripcion;

    if (!archivo) {
        elemento.hidden = true;
        elemento.removeAttribute("src");
        return;
    }

    elemento.hidden = false;

    elemento.onerror = function () {
        this.hidden = true;
    };

    elemento.src = rutaImagenes + archivo;
}

// Cambiar el índice al avanzar o retroceder.
function moverIndice(indice, lista, direccion) {
    return (indice + direccion + lista.length) % lista.length;
}








//--------- CONTENIDO DE LUZ ---------//

// Mostrar solamente la definición de la luz.
function mostrarQueEs(luz) {
    agregarTexto(cuadro2, luz["Que es"]);
}

// Mostrar nombres y descripciones.
// Se utiliza en Propiedades y Medición.
// Mostrar nombres, descripciones e imágenes.
function mostrarLista(elementos, propiedadSecundaria) {

    elementos.forEach(function (elemento) {

        // Cuadro 1: nombre.
        agregarTexto(cuadro1, elemento.nombre);

        // Cuadro 2: descripción o temperatura.
        if (elemento[propiedadSecundaria]) {
            agregarTexto(
                cuadro2,
                elemento[propiedadSecundaria]
            );
        }

        // Cuadro 3: imagen.
        agregarImagen(
            cuadro3,
            elemento.imagen,
            elemento.nombre
        );

    });
}

// Mostrar los datos de IRC o CRI.
// Mostrar los datos de IRC o CRI.
function mostrarIRC(datos) {

    // Cuadro 1: descripción general.
    agregarTexto(cuadro1, datos.descripcion);

    // Recorrer los niveles del IRC.
    datos.niveles.forEach(function (nivel) {

        // Cuadro 2: nombre, valor y descripción.
        const titulo = document.createElement("h3");
        titulo.textContent = nivel.nombre;
        cuadro2.appendChild(titulo);

        agregarTexto(cuadro2, "Valor: " + nivel.valor);

        agregarTexto(
            cuadro2,
            "Descripción: " + nivel.descripcion
        );

        // Cuadro 3: imagen.
        agregarImagen(
            cuadro3,
            nivel.imagen,
            nivel.nombre
        );

    });
}

// Mostrar los datos de deslumbramiento.
// Mostrar los datos de deslumbramiento.
function mostrarDeslumbramiento(datos) {

    // Cuadro 1: descripción general.
    agregarTexto(cuadro1, datos.descripcion);

    // Recorrer los tipos de deslumbramiento.
    datos.tipos.forEach(function (tipo) {

        // Cuadro 2: nombre y descripción.
        const titulo = document.createElement("h3");
        titulo.textContent = tipo.nombre;
        cuadro2.appendChild(titulo);

        agregarTexto(
            cuadro2,
            tipo.descripcion
        );

        // Cuadro 3: imagen.
        agregarImagen(
            cuadro3,
            tipo.imagen,
            tipo.nombre
        );

    });
}

// Cambiar la apariencia del botón seleccionado.
function activarBoton(botonSeleccionado) {

    botonesLuz.forEach(function (boton) {
        boton.classList.remove("active");
    });

    botonSeleccionado.classList.add("active");
}

// Mostrar el contenido según el botón seleccionado.
function cambiarContenidoLuz(numeroBoton, luz) {

    // Borrar la información anterior.
    limpiarCuadros();

    switch (numeroBoton) {

        case 1:
            mostrarQueEs(luz);
            break;

        case 2:
            mostrarLista(luz.Propiedades, "descripcion");
            break;

        case 3:
            mostrarLista(luz.Medicion, "descripcion");
            break;

        case 4:
            mostrarLista(luz.Color, "temperatura");
            break;

        case 5:
            mostrarIRC(luz.IRCoCRI);
            break;

        case 6:
            mostrarDeslumbramiento(luz.Deslumbramiento);
            break;

    }
}










//--------- LÁMPARAS ---------//

// Iniciar los tres carruseles.
function iniciarLamparas(lampara) {

    // Obtener los datos de cada lista del JSON.
    const tipos = lampara.tipos || [];
    const luminarias = lampara.luminarias || [];
    const elementos = lampara.elementos || [];


    //--------- ELEMENTOS HTML ---------//

    // Carrusel de tipos de lámparas.
    const tituloTipo = document.querySelector(".lamp-type-title");
    const imagenTipo = document.querySelector(".lamp-type-image");

    const colorTipo = document.querySelector(".color_cuadro-1 p");
    const vidaTipo = document.querySelector(".potencia_cuadro-2 p");
    const usoTipo = document.querySelector(".lugar_cuadro-3 p");

    const tipoAnterior = document.querySelector(".lampara_cuadro_1_0");
    const tipoSiguiente = document.querySelector(".lampara_cuadro_1_1");


    // Carrusel de luminarias.
    const tituloLuminaria = document.querySelector(".lampara_wt_cuadro_1");
    const imagenLuminaria = document.querySelector(".luminaria-image");

    const luminariaAnterior = document.querySelector(".lampara_cuadro_2_0");
    const luminariaSiguiente = document.querySelector(".lampara_cuadro_2_1");


    // Carrusel de elementos.
    const tituloElemento = document.querySelector(".lampara_wb_cuadro_2");
    const imagenElemento = document.querySelector(".elemento-image");

    const elementoAnterior = document.querySelector(".lampara_cuadro_3_0");
    const elementoSiguiente = document.querySelector(".lampara_cuadro_3_1");


    //--------- ÍNDICES ---------//

    let indiceTipo = 0;
    let indiceLuminaria = 0;
    let indiceElemento = 0;


    //--------- MOSTRAR TIPO DE LÁMPARA ---------//

    function mostrarTipo() {

        if (tipos.length === 0) {
            return;
        }

        const tipo = tipos[indiceTipo];

        // Título.
        tituloTipo.textContent = tipo.nombre;

        // Imagen.
        colocarImagen(imagenTipo, tipo.imagen, tipo.nombre);

        // Color.
        colorTipo.textContent = "-" + (tipo.color || "");

        // Vida útil.
        vidaTipo.textContent = "-" + (tipo.vidaUtil || "");

        // Uso.
        usoTipo.textContent = "-" + (tipo.uso || "");
    }


    //--------- MOSTRAR LUMINARIA ---------//

    function mostrarLuminaria() {

        if (luminarias.length === 0) {
            return;
        }

        const luminaria = luminarias[indiceLuminaria];

        tituloLuminaria.textContent = luminaria.nombre;

        colocarImagen(
            imagenLuminaria,
            luminaria.imagen,
            luminaria.nombre
        );
    }


    //--------- MOSTRAR ELEMENTO ---------//

    function mostrarElemento() {

        if (elementos.length === 0) {
            return;
        }

        const elemento = elementos[indiceElemento];

        tituloElemento.textContent = elemento.nombre;

        colocarImagen(
            imagenElemento,
            elemento.imagen,
            elemento.nombre
        );
    }


    //--------- BOTONES TIPO DE LÁMPARA ---------//

    tipoAnterior.addEventListener("click", function () {

        indiceTipo = moverIndice(indiceTipo, tipos, -1);

        mostrarTipo();
    });

    tipoSiguiente.addEventListener("click", function () {

        indiceTipo = moverIndice(indiceTipo, tipos, 1);

        mostrarTipo();
    });


    //--------- BOTONES LUMINARIAS ---------//

    luminariaAnterior.addEventListener("click", function () {

        indiceLuminaria = moverIndice(indiceLuminaria, luminarias, -1);

        mostrarLuminaria();
    });

    luminariaSiguiente.addEventListener("click", function () {

        indiceLuminaria = moverIndice(indiceLuminaria, luminarias, 1);

        mostrarLuminaria();
    });


    //--------- BOTONES ELEMENTOS ---------//

    elementoAnterior.addEventListener("click", function () {

        indiceElemento = moverIndice(indiceElemento, elementos, -1);

        mostrarElemento();
    });

    elementoSiguiente.addEventListener("click", function () {

        indiceElemento = moverIndice(indiceElemento, elementos, 1);

        mostrarElemento();
    });


    //--------- MOSTRAR LOS PRIMEROS DATOS ---------//

    mostrarTipo();
    mostrarLuminaria();
    mostrarElemento();

}









//--------- ILUMINACIÓN ---------//

function iniciarIluminacion(iluminacion) {

    // Obtener las listas del JSON.
    const sistemas = iluminacion.sistemas || [];
    const metodos = iluminacion.metodos || [];

    // Elementos de sistemas.
    const nombreSistema = document.querySelector(".sistema-nombre");
    const imagenSistema = document.querySelector(".sistema-imagen");

    const sistemaAnterior = document.querySelector(".ilum_cuadro_1_0");
    const sistemaSiguiente = document.querySelector(".ilum_cuadro_1_1");

    // Elementos de métodos.
    const nombreMetodo = document.querySelector(".metodo-nombre");
    const imagenMetodo = document.querySelector(".metodo-imagen");
    const descripcionMetodo = document.querySelector(".metodo-descripcion");

    const metodoAnterior = document.querySelector(".ilum_cuadro_2_0");
    const metodoSiguiente = document.querySelector(".ilum_cuadro_2_1");

    // Índices independientes.
    let indiceSistema = 0;
    let indiceMetodo = 0;


    // Mostrar sistema.
    function mostrarSistema() {

        if (sistemas.length === 0) {
            return;
        }

        const sistema = sistemas[indiceSistema];

        nombreSistema.textContent = sistema.nombre;

        colocarImagen(
            imagenSistema,
            sistema.imagen,
            sistema.nombre
        );
    }


    // Mostrar método.
    function mostrarMetodo() {

        if (metodos.length === 0) {
            return;
        }

        const metodo = metodos[indiceMetodo];

        nombreMetodo.textContent = metodo.nombre;

        colocarImagen(
            imagenMetodo,
            metodo.imagen,
            metodo.nombre
        );

        descripcionMetodo.textContent = metodo.descripcion || "";
    }


    // Botones de sistemas.
    sistemaAnterior.addEventListener("click", function () {

        indiceSistema = moverIndice(indiceSistema, sistemas, -1);

        mostrarSistema();
    });

    sistemaSiguiente.addEventListener("click", function () {

        indiceSistema = moverIndice(indiceSistema, sistemas, 1);

        mostrarSistema();
    });


    // Botones de métodos.
    metodoAnterior.addEventListener("click", function () {

        indiceMetodo = moverIndice(indiceMetodo, metodos, -1);

        mostrarMetodo();
    });

    metodoSiguiente.addEventListener("click", function () {

        indiceMetodo = moverIndice(indiceMetodo, metodos, 1);

        mostrarMetodo();
    });


    // Mostrar los primeros datos.
    mostrarSistema();
    mostrarMetodo();

}










//--------- DISEÑO ---------//
function iniciarDiseno(diseno) {
    
    const categorias = [
        { nombre: "Lugar", clave: "lugares" },
        { nombre: "Espacio", clave: "espacios" },
        { nombre: "Actividad", clave: "actividades" },
        { nombre: "Nivel de iluminacion", clave: "Nivel de iluminacion", imagenCompleta: true },
        { nombre: "Calculo iluminacion", clave: "Calculo iluminacion", calculo: true }
    ];

    const tituloCategoria = document.querySelector(".diseno-tag");
    const grid = document.querySelector(".diseno-grid");
    const botonAnterior = document.querySelector(".diseno_cuadro_1_0");
    const botonSiguiente = document.querySelector(".diseno_cuadro_1_1");
    const tarjetas = grid.querySelectorAll(".card-wrapper-relative");
    const decoraciones = document.querySelectorAll('[class*="deco-"]');

    // Referencias a los elementos que ya existen en el HTML
    const imagenNivel = grid.querySelector(".nivel-iluminacion-imagen");
    const formularioCalculo = grid.querySelector(".formulario-calculo");
    const seleccionEspacio = formularioCalculo.querySelector("#seleccionEspacio");
    const areaEspacio = formularioCalculo.querySelector("#areaEspacio");
    const botonIngresar = formularioCalculo.querySelector("#botonIngresar");
    const cajaResultado = formularioCalculo.querySelector("#resultado-calculo-box");

    let indiceCategoria = 0;

    // Función para resetear la vista del cálculo al cambiar inputs
    function reiniciarCalculo() {
        cajaResultado.classList.add("oculto");
        cajaResultado.textContent = "";
        botonIngresar.classList.remove("oculto");
    }

    seleccionEspacio.addEventListener("change", reiniciarCalculo);
    areaEspacio.addEventListener("input", reiniciarCalculo);

    // Evento del botón para calcular y guardar en la base de datos
    botonIngresar.addEventListener("click", function () {
        const lux = Number(seleccionEspacio.value);
        const area = Number(areaEspacio.value);
        const nombreEspacio = seleccionEspacio.options[
            seleccionEspacio.selectedIndex
        ].text.split(" (")[0];

        if (
            !seleccionEspacio.value ||
            !Number.isFinite(lux) ||
            lux <= 0 ||
            !Number.isFinite(area) ||
            area <= 0
        ) {
            alert("Selecciona un espacio e ingresa un área válida.");
            return;
        }

        const token_sesion = sessionStorage.getItem("token_sesion");

        if (!token_sesion) {
            alert("Debes iniciar sesión para guardar el cálculo.");
            return;
        }

        fetch("http://localhost:3000/api/calculos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token_sesion
            },
            body: JSON.stringify({
                espacio: nombreEspacio,
                lux: lux,
                area: area
            })
        })
        .then(respuesta => respuesta.json().then(datos => ({
            status: respuesta.status,
            datos: datos
        })))
        .then(resultado => {
            if (resultado.status !== 201) {
                alert(resultado.datos.mensaje);
                return;
            }

            const lumenes = Math.round(area * lux);

            botonIngresar.classList.add("oculto");
            cajaResultado.textContent = `Resultado para ${nombreEspacio} (${area} m²): ${lumenes.toLocaleString("es-MX")} lúmenes`;
            cajaResultado.classList.remove("oculto");
        })
        .catch(error => {
            console.log(error);
            alert("No se pudo conectar con el servidor.");
        });
    });

    function mostrarCategoria() {
        const categoria = categorias[indiceCategoria];

        // Mostrar u ocultar decoraciones exteriores
        decoraciones.forEach(function (deco) {
            if (categoria.imagenCompleta || categoria.calculo) {
                deco.classList.add("oculto");
            } else {
                deco.classList.remove("oculto");
            }
        });

        tituloCategoria.textContent = categoria.nombre;

        // Ocultar todo por defecto antes de mostrar lo que corresponde
        tarjetas.forEach(tarjeta => tarjeta.classList.add("oculto"));
        imagenNivel.classList.add("oculto");
        formularioCalculo.classList.add("oculto");

        // 1. Nivel de iluminación
        if (categoria.imagenCompleta) {
            imagenNivel.classList.remove("oculto");
            colocarImagen(imagenNivel, diseno[categoria.clave].imagen, categoria.nombre);
            return;
        }

        // 2. Cálculo de iluminación
        if (categoria.calculo) {
            formularioCalculo.classList.remove("oculto");
            return;
        }

        // 3. Lugar, Espacio y Actividad (8 tarjetas)
        const lista = diseno[categoria.clave] || [];

        tarjetas.forEach(function (tarjeta, indice) {
            const imagen = tarjeta.querySelector(".diseno-imagen");
            const elemento = lista[indice];

            if (elemento) {
                colocarImagen(imagen, elemento.imagen, elemento.nombre);
                tarjeta.classList.remove("oculto");
                tarjeta.setAttribute("aria-label", elemento.nombre);
            }
        });
    }

    botonAnterior.addEventListener("click", function () {
        indiceCategoria = moverIndice(indiceCategoria, categorias, -1);
        mostrarCategoria();
    });

    botonSiguiente.addEventListener("click", function () {
        indiceCategoria = moverIndice(indiceCategoria, categorias, 1);
        mostrarCategoria();
    });

    mostrarCategoria();
}
/*
// Función auxiliar para registrar el cálculo en el backend y sincronizarlo con el Perfil
function guardarCalculoEnPerfil(datosCalculo) {
    const token = sessionStorage.getItem("token_sesion");
    if (!token) return;

    fetch("http://localhost:3000/api/perfil/calculos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(datosCalculo)
    })
    .catch(err => console.log("Error al guardar el cálculo en el perfil:", err));
}
*/








//--------- CONEXIÓN CON LA API ---------//

// Obtener el token de la sesión.
const token_sesion = sessionStorage.getItem("token_sesion");

// Comprobar si existe una sesión.
if (!token_sesion) {

    window.location.href = "login_registro.html";

} else {

    // Solicitar la información de WikiLuz.
    fetch("http://localhost:3000/api/wikiLuz", {
        headers: {
            "Authorization": "Bearer " + token_sesion
        }
    })
    .then(function (recurso) {

        // Comprobar si la sesión es válida.
        if (recurso.status === 401) {

            sessionStorage.removeItem("token_sesion");
            window.location.href = "login_registro.html";

            return;
        }

        if (!recurso.ok) {
            throw new Error("No se pudo obtener la información.");
        }

        // Convertir la respuesta a JSON.
        return recurso.json();

    })
    .then(function (respuesta) {

        // Comprobar que se recibieron datos.
        if (!respuesta) {
            return;
        }

        // Obtener el contenido de Luz.
        const luz = respuesta.luz;

        // Mostrar la información inicial.
        cambiarContenidoLuz(1, luz);

        // Relacionar los botones con su contenido.
        botonesLuz.forEach(function (boton, indice) {

            boton.addEventListener("click", function () {

                activarBoton(boton);
                cambiarContenidoLuz(indice + 1, luz);

            });

        });

        if (botonesLuz.length > 0) {
            activarBoton(botonesLuz[0]);
        }

        // Iniciar las demás secciones.
        iniciarLamparas(respuesta.lampara);
        iniciarIluminacion(respuesta.iluminacion);
        iniciarDiseno(respuesta.diseno);

    })
    .catch(function (error) {

        console.log("Error al cargar WikiLuz:", error);

        limpiarCuadros();

        agregarTexto(
            cuadro2,
            "No se pudo cargar la información de WikiLuz."
        );

    });

}










//--------- NAVEGACIÓN PRINCIPAL ---------//


document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll(".screen-section");

    const navButtons = document.querySelectorAll(
        ".sticky-nav-bar .nav-btn"
    );

    function updateActiveNav() {

        const homeSection = document.getElementById("inicio");

        if (!homeSection) {
            return;
        }

        // Si estamos en Inicio, quitar selección del menú.
        if (window.scrollY < homeSection.offsetHeight / 2) {

            navButtons.forEach(function (boton) {
                boton.classList.remove("active");
            });

            return;
        }

        // Detectar si el usuario llegó al final de la página (para forzar la última sección "diseño")
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 30);

        sections.forEach(function (section, index) {

            const sectionTop = section.offsetTop - 500; // Margen de activación ajustado para 80vh
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            // Si estamos abajo de todo, activar directamente la última sección
            if (isAtBottom && index === sections.length - 1) {
                navButtons.forEach(function (boton) {
                    boton.classList.remove("active");
                    if (boton.getAttribute("href") === "#" + sectionId) {
                        boton.classList.add("active");
                    }
                });
                return;
            }

            // Comportamiento normal para las demás secciones de 80vh
            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {

                navButtons.forEach(function (boton) {

                    boton.classList.remove("active");

                    if (boton.getAttribute("href") === "#" + sectionId) {
                        boton.classList.add("active");
                    }

                });

            }

        });

    }

    window.addEventListener("scroll", updateActiveNav);

    // Seleccionar el enlace al presionarlo manualmente.
    navButtons.forEach(function (boton) {

        boton.addEventListener("click", function () {

            navButtons.forEach(function (otroBoton) {
                otroBoton.classList.remove("active");
            });

            this.classList.add("active");

        });

    });

});