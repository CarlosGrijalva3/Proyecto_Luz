"use strict";

//--------- VARIABLES Y REFERENCIAS ---------//
const cuadro1 = document.querySelector(".luz_cuadro_1 .card-content-inner");
const cuadro2 = document.querySelector(".luz_cuadro_2 .card-content-inner");
const cuadro3 = document.querySelector(".luz_cuadro_3 .card-content-inner");

const botonesLuz = document.querySelectorAll(".luz-sidebar .luz-btn");
const rutaImagenes = "../assets/images/";

let refrescarLuzModoOscuro = null;
let refrescarLamparasModoOscuro = null;
let refrescarIluminacionModoOscuro = null;


//--------- FUNCIONES GENERALES ---------//
function limpiarCuadros() {
    cuadro1.replaceChildren();
    cuadro2.replaceChildren();
    cuadro3.replaceChildren();
}

function agregarTexto(contenedor, texto) {
    const parrafo = document.createElement("p");
    parrafo.textContent = texto;
    contenedor.appendChild(parrafo);
}

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
/*
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
*/
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

    const archivoFinal = aplicarModoImagen(archivo);
    elemento.src = rutaImagenes + archivoFinal;
}

function moverIndice(indice, lista, direccion) {
    return (indice + direccion + lista.length) % lista.length;
}





//--------- CONTENIDO DE LUZ ---------//
function mostrarQueEs(luz) {
    agregarTexto(cuadro2, luz["Que es"]);
}

function mostrarLista(elementos, propiedadSecundaria) {
    elementos.forEach(function (elemento) {
        agregarTexto(cuadro1, elemento.nombre);

        if (elemento[propiedadSecundaria]) {
            agregarTexto(cuadro2, elemento[propiedadSecundaria]);
        }

        agregarImagen(cuadro3, elemento.imagen, elemento.nombre);
    });
}

function mostrarIRC(datos) {
    agregarTexto(cuadro1, datos.descripcion);

    datos.niveles.forEach(function (nivel) {
        const titulo = document.createElement("h3");
        titulo.textContent = nivel.nombre;
        cuadro2.appendChild(titulo);

        agregarTexto(cuadro2, "Valor: " + nivel.valor);
        agregarTexto(cuadro2, "Descripción: " + nivel.descripcion);
        agregarImagen(cuadro3, nivel.imagen, nivel.nombre);
    });
}

function mostrarDeslumbramiento(datos) {
    agregarTexto(cuadro1, datos.descripcion);

    datos.tipos.forEach(function (tipo) {
        const titulo = document.createElement("h3");
        titulo.textContent = tipo.nombre;
        cuadro2.appendChild(titulo);

        agregarTexto(cuadro2, tipo.descripcion);
        agregarImagen(cuadro3, tipo.imagen, tipo.nombre);
    });
}

function activarBoton(botonSeleccionado) {
    botonesLuz.forEach(function (boton) {
        boton.classList.remove("active");
    });

    botonSeleccionado.classList.add("active");
}

function cambiarContenidoLuz(numeroBoton, luz) {
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
function iniciarLamparas(lampara) {
    const tipos = lampara.tipos || [];
    const luminarias = lampara.luminarias || [];
    const elementos = lampara.elementos || [];

    const tituloTipo = document.querySelector(".lamp-type-title");
    const imagenTipo = document.querySelector(".lamp-type-image");
    const colorTipo = document.querySelector(".color_cuadro-1 p");
    const vidaTipo = document.querySelector(".potencia_cuadro-2 p");
    const usoTipo = document.querySelector(".lugar_cuadro-3 p");
    const tipoAnterior = document.querySelector(".lampara_cuadro_1_0");
    const tipoSiguiente = document.querySelector(".lampara_cuadro_1_1");

    const tituloLuminaria = document.querySelector(".lampara_wt_cuadro_1");
    const imagenLuminaria = document.querySelector(".luminaria-image");
    const luminariaAnterior = document.querySelector(".lampara_cuadro_2_0");
    const luminariaSiguiente = document.querySelector(".lampara_cuadro_2_1");

    const tituloElemento = document.querySelector(".lampara_wb_cuadro_2");
    const imagenElemento = document.querySelector(".elemento-image");
    const elementoAnterior = document.querySelector(".lampara_cuadro_3_0");
    const elementoSiguiente = document.querySelector(".lampara_cuadro_3_1");

    let indiceTipo = 0;
    let indiceLuminaria = 0;
    let indiceElemento = 0;

    function mostrarTipo() {
        if (tipos.length === 0) {
            return;
        }

        const tipo = tipos[indiceTipo];
        tituloTipo.textContent = tipo.nombre;
        colocarImagen(imagenTipo, tipo.imagen, tipo.nombre);
        colorTipo.textContent = "-" + (tipo.color || "");
        vidaTipo.textContent = "-" + (tipo.vidaUtil || "");
        usoTipo.textContent = "-" + (tipo.uso || "");
    }

    function mostrarLuminaria() {
        if (luminarias.length === 0) {
            return;
        }

        const luminaria = luminarias[indiceLuminaria];
        tituloLuminaria.textContent = luminaria.nombre;
        colocarImagen(imagenLuminaria, luminaria.imagen, luminaria.nombre);
    }

    function mostrarElemento() {
        if (elementos.length === 0) {
            return;
        }

        const elemento = elementos[indiceElemento];
        tituloElemento.textContent = elemento.nombre;
        colocarImagen(imagenElemento, elemento.imagen, elemento.nombre);
    }

    
    refrescarLamparasModoOscuro = function () {
        mostrarTipo();
        mostrarLuminaria();
        mostrarElemento();
    };

    tipoAnterior.addEventListener("click", function () {
        transicionarEscalonado(
            tituloTipo,
            [imagenTipo, colorTipo, vidaTipo, usoTipo],
            function () {
                indiceTipo = moverIndice(indiceTipo, tipos, -1);
                mostrarTipo();
            }
        );
    });

    tipoSiguiente.addEventListener("click", function () {
        transicionarEscalonado(
            tituloTipo,
            [imagenTipo, colorTipo, vidaTipo, usoTipo],
            function () {
                indiceTipo = moverIndice(indiceTipo, tipos, 1);
                mostrarTipo();
            }
        );
    });

    luminariaAnterior.addEventListener("click", function () {
        transicionarEscalonado(
            tituloLuminaria,
            imagenLuminaria,
            function () {
                indiceLuminaria = moverIndice(indiceLuminaria, luminarias, -1);
                mostrarLuminaria();
            }
        );
    });

    luminariaSiguiente.addEventListener("click", function () {
        transicionarEscalonado(
            tituloLuminaria,
            imagenLuminaria,
            function () {
                indiceLuminaria = moverIndice(indiceLuminaria, luminarias, 1);
                mostrarLuminaria();
            }
        );
    });

    elementoAnterior.addEventListener("click", function () {
        transicionarEscalonado(
            tituloElemento,
            imagenElemento,
            function () {
                indiceElemento = moverIndice(indiceElemento, elementos, -1);
                mostrarElemento();
            }
        );
    });

    elementoSiguiente.addEventListener("click", function () {
        transicionarEscalonado(
            tituloElemento,
            imagenElemento,
            function () {
                indiceElemento = moverIndice(indiceElemento, elementos, 1);
                mostrarElemento();
            }
        );
    });

    mostrarTipo();
    mostrarLuminaria();
    mostrarElemento();
}





//--------- ILUMINACIÓN ---------//
function iniciarIluminacion(iluminacion) {
    
    refrescarIluminacionModoOscuro = function () {
    mostrarSistema();
    mostrarMetodo();
    };

    const sistemas = iluminacion.sistemas || [];
    const metodos = iluminacion.metodos || [];

    const nombreSistema = document.querySelector(".sistema-nombre");
    const imagenSistema = document.querySelector(".sistema-imagen");
    const sistemaAnterior = document.querySelector(".ilum_cuadro_1_0");
    const sistemaSiguiente = document.querySelector(".ilum_cuadro_1_1");

    const nombreMetodo = document.querySelector(".metodo-nombre");
    const imagenMetodo = document.querySelector(".metodo-imagen");
    const descripcionMetodo = document.querySelector(".metodo-descripcion");
    const metodoAnterior = document.querySelector(".ilum_cuadro_2_0");
    const metodoSiguiente = document.querySelector(".ilum_cuadro_2_1");

    let indiceSistema = 0;
    let indiceMetodo = 0;

    function mostrarSistema() {
        if (sistemas.length === 0) {
            return;
        }

        const sistema = sistemas[indiceSistema];
        nombreSistema.textContent = sistema.nombre;
        colocarImagen(imagenSistema, sistema.imagen, sistema.nombre);
    }

    function mostrarMetodo() {
        if (metodos.length === 0) {
            return;
        }

        const metodo = metodos[indiceMetodo];
        nombreMetodo.textContent = metodo.nombre;
        colocarImagen(imagenMetodo, metodo.imagen, metodo.nombre);
        descripcionMetodo.textContent = metodo.descripcion || "";
    }

    sistemaAnterior.addEventListener("click", function () {
        transicionarEscalonado(
            nombreSistema,
            imagenSistema,
            function () {
                indiceSistema = moverIndice(indiceSistema, sistemas, -1);
                mostrarSistema();
            }
        );
    });

    sistemaSiguiente.addEventListener("click", function () {
        transicionarEscalonado(
            nombreSistema,
            imagenSistema,
            function () {
                indiceSistema = moverIndice(indiceSistema, sistemas, 1);
                mostrarSistema();
            }
        );
    });

    metodoAnterior.addEventListener("click", function () {
        transicionarEscalonado(
            nombreMetodo,
            [imagenMetodo, descripcionMetodo],
            function () {
                indiceMetodo = moverIndice(indiceMetodo, metodos, -1);
                mostrarMetodo();
            }
        );
    });

    metodoSiguiente.addEventListener("click", function () {
        transicionarEscalonado(
            nombreMetodo,
            [imagenMetodo, descripcionMetodo],
            function () {
                indiceMetodo = moverIndice(indiceMetodo, metodos, 1);
                mostrarMetodo();
            }
        );
    });

    mostrarSistema();
    mostrarMetodo();
}






//--------- DISEÑO ---------//
let refrescarDisenoModoOscuro = null;

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

    const imagenNivel = grid.querySelector(".nivel-iluminacion-imagen");
    const formularioCalculo = grid.querySelector(".formulario-calculo");
    const seleccionEspacio = formularioCalculo.querySelector("#seleccionEspacio");
    const areaEspacio = formularioCalculo.querySelector("#areaEspacio");
    const botonIngresar = formularioCalculo.querySelector("#botonIngresar");
    const cajaResultado = formularioCalculo.querySelector("#resultado-calculo-box");

    let indiceCategoria = 0;

    function archivoSegunModoOscuro(archivo, aplicarOscuro) {
        if (!archivo || !aplicarOscuro) {
            return archivo;
        }
        const esOscuroActivo = document.body.classList.contains("modo-oscuro");
        if (!esOscuroActivo || archivo.includes("_oscuro.")) {
            return archivo;
        }
        return archivo.replace(/(\.[^.]+)$/, "_oscuro$1");
    }

    function reiniciarCalculo() {
        cajaResultado.classList.add("oculto");
        cajaResultado.textContent = "";
        botonIngresar.classList.remove("oculto");
    }

    seleccionEspacio.addEventListener("change", reiniciarCalculo);
    areaEspacio.addEventListener("input", reiniciarCalculo);

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

        const token = sessionStorage.getItem("token_sesion");

        if (!token) {
            alert("Debes iniciar sesión para guardar el cálculo.");
            return;
        }

        fetch("http://localhost:3000/api/calculos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                espacio: nombreEspacio,
                lux: lux,
                area: area
            })
        })
        .then(function (respuesta) {
            return respuesta.json().then(function (datos) {
                return {
                    status: respuesta.status,
                    datos: datos
                };
            });
        })
        .then(function (resultado) {
            if (resultado.status !== 201) {
                alert(resultado.datos.mensaje);
                return;
            }

            const lumenes = Math.round(area * lux);

            botonIngresar.classList.add("oculto");
            cajaResultado.textContent = `Resultado para ${nombreEspacio} (${area} m²): ${lumenes.toLocaleString("es-MX")} lúmenes`;
            cajaResultado.classList.remove("oculto");
        })
        .catch(function (error) {
            console.log(error);
            alert("No se pudo conectar con el servidor.");
        });
    });

    function mostrarCategoria() {
        const categoria = categorias[indiceCategoria];

        decoraciones.forEach(function (deco) {
            if (categoria.imagenCompleta || categoria.calculo) {
                deco.classList.add("oculto");
            } else {
                deco.classList.remove("oculto");
            }
        });

        tituloCategoria.textContent = categoria.nombre;

        tarjetas.forEach(function (tarjeta) {
            tarjeta.classList.add("oculto");
        });
        imagenNivel.classList.add("oculto");
        formularioCalculo.classList.add("oculto");

        if (categoria.imagenCompleta) {
            imagenNivel.classList.remove("oculto");
            const archivoNivel = archivoSegunModoOscuro(diseno[categoria.clave].imagen, true);
            colocarImagen(imagenNivel, archivoNivel, categoria.nombre);
            return;
        }

        if (categoria.calculo) {
            formularioCalculo.classList.remove("oculto");
            return;
        }

        const lista = diseno[categoria.clave] || [];
        const esLugar = categoria.clave === "lugares";

        tarjetas.forEach(function (tarjeta, indice) {
            const imagen = tarjeta.querySelector(".diseno-imagen");
            const elemento = lista[indice];

            if (elemento) {
                const archivoFinal = archivoSegunModoOscuro(elemento.imagen, esLugar);
                colocarImagen(imagen, archivoFinal, elemento.nombre);
                tarjeta.classList.remove("oculto");
                tarjeta.setAttribute("aria-label", elemento.nombre);
            }
        });
    }

    refrescarDisenoModoOscuro = mostrarCategoria;

    botonAnterior.addEventListener("click", function () {
        transicionarCambio(
            [tituloCategoria, ...grid.querySelectorAll(".diseno-imagen"), imagenNivel, formularioCalculo],
            function () {
                indiceCategoria = moverIndice(indiceCategoria, categorias, -1);
                mostrarCategoria();
            }
        );
    });

    botonSiguiente.addEventListener("click", function () {
        transicionarCambio(
            [tituloCategoria, ...grid.querySelectorAll(".diseno-imagen"), imagenNivel, formularioCalculo],
            function () {
                indiceCategoria = moverIndice(indiceCategoria, categorias, 1);
                mostrarCategoria();
            }
        );
    });

    mostrarCategoria();
}






//--------- CONEXIÓN CON LA API ---------//
const token_sesion = sessionStorage.getItem("token_sesion");

if (!token_sesion) {
    window.location.href = "login_registro.html";
} else {
    fetch("http://localhost:3000/api/wikiLuz", {
        headers: {
            "Authorization": "Bearer " + token_sesion
        }
    })
    .then(function (recurso) {
        if (recurso.status === 401) {
            sessionStorage.removeItem("token_sesion");
            window.location.href = "login_registro.html";
            return;
        }

        if (!recurso.ok) {
            throw new Error("No se pudo obtener la información.");
        }

        return recurso.json();
    })
    .then(function (respuesta) {
        if (!respuesta) {
            return;
        }
        /*
        const luz = respuesta.luz;
        cambiarContenidoLuz(1, luz);
        */
        const luz = respuesta.luz;
        let botonLuzActual = 1;
        cambiarContenidoLuz(botonLuzActual, luz);
        refrescarLuzModoOscuro = function () {
            cambiarContenidoLuz(botonLuzActual, luz);
       
        };


        botonesLuz.forEach(function (boton, indice) {
            boton.addEventListener("click", function () {
                botonLuzActual = indice + 1;
                activarBoton(boton);
                transicionarCambio(
                    [cuadro1, cuadro2, cuadro3],
                    function () {
                        //cambiarContenidoLuz(indice + 1, luz);
                        cambiarContenidoLuz(botonLuzActual, luz);
                    }
                );
            });
        });

        if (botonesLuz.length > 0) {
            activarBoton(botonesLuz[0]);
        }

        iniciarLamparas(respuesta.lampara);
        iniciarIluminacion(respuesta.iluminacion);
        iniciarDiseno(respuesta.diseno);
    })
    .catch(function (error) {
        console.log("Error al cargar WikiLuz:", error);
        limpiarCuadros();
        agregarTexto(cuadro2, "No se pudo cargar la información de WikiLuz.");
    });
}




//--------- NAVEGACIÓN PRINCIPAL ---------//
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".screen-section");
    const navButtons = document.querySelectorAll(".sticky-nav-bar .nav-btn");

    function updateActiveNav() {
        const homeSection = document.getElementById("inicio");

        if (!homeSection) {
            return;
        }

        if (window.scrollY < homeSection.offsetHeight / 2) {
            navButtons.forEach(function (boton) {
                boton.classList.remove("active");
            });
            return;
        }

        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 30);

        sections.forEach(function (section, index) {
            const sectionTop = section.offsetTop - 500;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (isAtBottom && index === sections.length - 1) {
                navButtons.forEach(function (boton) {
                    boton.classList.remove("active");
                    if (boton.getAttribute("href") === "#" + sectionId) {
                        boton.classList.add("active");
                    }
                });
                return;
            }

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

    navButtons.forEach(function (boton) {
        boton.addEventListener("click", function () {
            navButtons.forEach(function (otroBoton) {
                otroBoton.classList.remove("active");
            });
            this.classList.add("active");
        });
    });
});





//--------- ANIMACIONES POR SECCIÓN ---------//
const seccionesAnimadas = document.querySelectorAll("#luz, #lampara, #iluminacion, #diseno");

if ("IntersectionObserver" in window && seccionesAnimadas.length > 0) {
    const observadorSecciones = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                entry.target.classList.remove("is-visible");
            }
        });
    }, {
        threshold: 0.2
    });

    seccionesAnimadas.forEach(function (sec) {
        observadorSecciones.observe(sec);
    });
}

function transicionarCambio(elementos, actualizarFn) {
    const lista = Array.isArray(elementos) ? elementos : [elementos];
    const validos = lista.filter(Boolean);

    validos.forEach(function (el) {
        el.classList.add("cambiando-dato");
    });

    setTimeout(function () {
        actualizarFn();

        requestAnimationFrame(function () {
            validos.forEach(function (el) {
                el.classList.remove("cambiando-dato");
            });
        });
    }, 150);
}

function transicionarEscalonado(elementosTitulo, elementosInfo, actualizarFn) {
    const titulos = (Array.isArray(elementosTitulo) ? elementosTitulo : [elementosTitulo]).filter(Boolean);
    const infos = (Array.isArray(elementosInfo) ? elementosInfo : [elementosInfo]).filter(Boolean);
    const todos = [...titulos, ...infos];

    todos.forEach(function (el) {
        el.classList.add("cambiando-dato");
    });

    setTimeout(function () {
        actualizarFn();

        requestAnimationFrame(function () {
            titulos.forEach(function (el) {
                el.classList.remove("cambiando-dato");
            });
        });

        setTimeout(function () {
            requestAnimationFrame(function () {
                infos.forEach(function (el) {
                    el.classList.remove("cambiando-dato");
                });
            });
        }, 140);
    }, 170);
}


//--------- INTERRUPTOR DE LUZ CON LA LÁMPARA ---------//
const lamparaInterruptor = document.querySelector(".lamp-cable-img");
const logoWikiLuz = document.querySelector(".logo-img-home");

const rutaLamparaNormal = "../assets/images/home/cable-lampara.png";
const rutaLamparaOscura = "../assets/images/home/cable-lampara_oscuro.png";

const rutaLogoNormal = "../assets/images/logo.png";
const rutaLogoOscuro = "../assets/images/logo_oscuro.png";

const flechaIzqNormal = "../assets/images/tu-flecha-izquierda.png";
const flechaIzqOscura = "../assets/images/tu-flecha-izquierda_oscuro.png";
const flechaDerNormal = "../assets/images/tu-flecha-derecha.png";
const flechaDerOscura = "../assets/images/tu-flecha-derecha_oscuro.png";

function actualizarFlechasModoOscuro(esOscuro) {
    const imagenesFlechas = document.querySelectorAll(".arrow-btn-dark img, .arrow-btn-yellow img");

    imagenesFlechas.forEach(function (img) {
        const srcActual = img.getAttribute("src") || "";

        if (srcActual.includes("tu-flecha-izquierda")) {
            img.src = esOscuro ? flechaIzqOscura : flechaIzqNormal;
        } else if (srcActual.includes("tu-flecha-derecha")) {
            img.src = esOscuro ? flechaDerOscura : flechaDerNormal;
        }
    });
}

function aplicarModoOscuroWikiLuz(esOscuro) {
    document.body.classList.toggle("modo-oscuro", esOscuro);

    if (lamparaInterruptor) {
        lamparaInterruptor.src = esOscuro ? rutaLamparaOscura : rutaLamparaNormal;
    }

    if (logoWikiLuz) {
        logoWikiLuz.src = esOscuro ? rutaLogoOscuro : rutaLogoNormal;
    }

    actualizarFlechasModoOscuro(esOscuro);

    if (typeof refrescarLuzModoOscuro === "function") {
        refrescarLuzModoOscuro();
    }
    if (typeof refrescarLamparasModoOscuro === "function") {
        refrescarLamparasModoOscuro();
    }
    if (typeof refrescarIluminacionModoOscuro === "function") {
        refrescarIluminacionModoOscuro();
    }
    if (typeof refrescarDisenoModoOscuro === "function") {
        refrescarDisenoModoOscuro();
    }

    if (typeof refrescarDisenoModoOscuro === "function") {
        refrescarDisenoModoOscuro();
    }
}

// Al cargar o recargar wikiLuz.html, revisa si quedó guardado el modo oscuro
const modoGuardado = localStorage.getItem("wikiluz_tema");
if (modoGuardado === "oscuro") {
    aplicarModoOscuroWikiLuz(true);
}

if (lamparaInterruptor) {
    lamparaInterruptor.addEventListener("click", function () {
        const esOscuro = !document.body.classList.contains("modo-oscuro");
        localStorage.setItem("wikiluz_tema", esOscuro ? "oscuro" : "claro");
        aplicarModoOscuroWikiLuz(esOscuro);
    });
}

function aplicarModoImagen(rutaOriginal) {
    if (!rutaOriginal) return "";
    if (!document.body.classList.contains("modo-oscuro")) {
        return rutaOriginal;
    }

    const punto = rutaOriginal.lastIndexOf(".");
    if (punto === -1) return rutaOriginal;

    const nombre = rutaOriginal.slice(0, punto);
    const extension = rutaOriginal.slice(punto);

    return nombre.endsWith("_oscuro") ? rutaOriginal : `${nombre}_oscuro${extension}`;
}

// Ejemplo al asignar una imagen que viene de tu JSON:
// imagenElemento.src = aplicarModoImagen(datoDelJson.imagen);