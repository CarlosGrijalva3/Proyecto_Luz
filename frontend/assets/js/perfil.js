"use strict";

const campoNombreAutenticado = document.querySelector("#input-usuario");// CAMPO DEL NOMBRE

const botonEditar = document.querySelector("#btn-editar");
const botonGuardar = document.querySelector("#btn-guardar");
const botonBorrar = document.querySelector("#btn-borrar-cuenta");
const img_perfil = document.querySelector(".img-perfil")
const listaCalculos = document.querySelector("#lista-calculos");

//----------------Foto cuenta------------------//




//----------------Editar nombre------------------//
botonEditar.addEventListener("click", function () {
    campoNombreAutenticado.disabled = false;
    campoNombreAutenticado.focus();
});

//----------------Guardar nombre------------------//

botonGuardar.addEventListener("click", function () {

    const nuevo_nombre = campoNombreAutenticado.value;

    fetch("http://localhost:3000/api/perfil", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token_sesion")
        },
        body: JSON.stringify({
            nombre: nuevo_nombre
        })
    })
    .then(function (respuesta) {
        return respuesta.json().then(function (datos) {
            return {
                correcto: respuesta.ok,
                datos: datos
            };
        });
    })
    .then(function (resultado) {

        if (resultado.correcto) {

            campoNombreAutenticado.value = resultado.datos.usuario.nombre;
            campoNombreAutenticado.disabled = true;

            alert(resultado.datos.mensaje);

        } else {

            alert(resultado.datos.mensaje);

        }

    })
    .catch(function (error) {
        console.log("Error:", error);
    });

});


//----------------Borrar cuenta------------------//

botonBorrar.addEventListener("click", function () {

    // Confirmar que queremos eliminar la cuenta.
    const confirmar = confirm("¿Estás seguro de que deseas borrar tu cuenta?");

    if (confirmar == false) {
        return;
    }

    fetch("http://localhost:3000/api/perfil", {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token_sesion")
        }
    })
    .then(function (respuesta) {
        return respuesta.json().then(function (datos) {
            return {
                correcto: respuesta.ok,
                datos: datos
            };
        });
    })
    .then(function (resultado) {

        if (resultado.correcto) {

            alert(resultado.datos.mensaje);

            // Eliminar el token de la sesión.
            sessionStorage.removeItem("token_sesion");

            // Regresar al login.
            window.location.href = "login_registro.html";

        } else {
            alert(resultado.datos.mensaje);
        }

    })
    .catch(function (error) {
        console.log("Error:", error);
    });

});


/* OBTENER LOS DATOS DEL USUARIO */
fetch("http://localhost:3000/api/perfil", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token_sesion")
    }
})
.then(function (respuesta) {return respuesta.json().then(function (datos) {return {
            correcto: respuesta.ok,
            datos: datos
        };
    });
})
.then(function (resultado) {

    if (resultado.correcto) {
        campoNombreAutenticado.value = resultado.datos.usuario.nombre;        // Mostrar el nombre del usuario.
    } else {
        window.location.href = "login_registro.html"; // Si la sesión no es válida, regresar al login.
    }

})
.catch(function (error) {
    console.log("Error:", error);
});


//---------------- Obtener cálculos del usuario ---------------(calculo_iluminacion)-//
fetch("http://localhost:3000/api/calculos", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token_sesion")
    }
})
.then(function (respuesta) {

    return respuesta.json().then(function (datos) {
        return {
            correcto: respuesta.ok,
            status: respuesta.status,
            datos: datos
        };
    });

})
.then(function (resultado) {

    // Comprobar si la sesión sigue siendo válida.
    if (resultado.status === 401) {

        sessionStorage.removeItem("token_sesion");
        window.location.href = "login_registro.html";
        return;

    }

    // Comprobar si hubo algún error.
    if (!resultado.correcto) {

        listaCalculos.textContent = resultado.datos.mensaje;
        return;

    }

    // Comprobar si el usuario tiene cálculos guardados.
    if (resultado.datos.length === 0) {

        listaCalculos.textContent = "Todavía no tienes cálculos guardados.";
        return;

    }




    // Recorrer los cálculos recibidos.
    resultado.datos.forEach(function (calculo) {

        const tarjeta = document.createElement("div");
        tarjeta.className = "calculo-card";

        const titulo = document.createElement("h3");
        titulo.textContent = calculo.espacio;

        tarjeta.appendChild(titulo);


        // Mostrar los datos del cálculo.
        const datos = [
            "Espacio: " + calculo.espacio,
            "Lux: " + calculo.lux + " lux",
            "Área: " + calculo.area + " m²",
            "Resultado: " + Number(calculo.lumenes_total).toLocaleString("es-MX") + " lm"
        ];

        datos.forEach(function (texto) {

            const parrafo = document.createElement("p");
            parrafo.textContent = texto;

            tarjeta.appendChild(parrafo);

        });


        // Crear el botón para borrar el cálculo.
        const botonEliminar = document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Borrar";
        botonEliminar.className = "btn-borrar-calculo";


        // Eliminar el cálculo al presionar el botón.
        botonEliminar.addEventListener("click", function () {

            const confirmar = confirm("¿Estás seguro de que deseas borrar este cálculo?");

            if (confirmar === false) {
                return;
            }


            // Enviar la petición DELETE al servidor.
            fetch("http://localhost:3000/api/calculos/" + calculo.id_calculo, {

                method: "DELETE",

                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("token_sesion")
                }

            })

            .then(function (respuesta) {

                return respuesta.json().then(function (datos) {

                    return {
                        correcto: respuesta.ok,
                        status: respuesta.status,
                        datos: datos
                    };

                });

            })

            .then(function (resultado) {

                // Comprobar si la sesión sigue siendo válida.
                if (resultado.status === 401) {

                    sessionStorage.removeItem("token_sesion");
                    window.location.href = "login_registro.html";

                    return;

                }


                // Comprobar si el cálculo se eliminó correctamente.
                if (!resultado.correcto) {

                    alert(resultado.datos.mensaje);
                    return;

                }


                // Quitar la tarjeta de la página.
                tarjeta.remove();

                // Comprobar si ya no quedan cálculos.
                if (listaCalculos.children.length === 0) {

                    listaCalculos.textContent = "Todavía no tienes cálculos guardados.";

                }

            })

            .catch(function (error) {

                console.log("Error al eliminar el cálculo:", error);
                alert("No se pudo conectar con el servidor.");

            });

        });


        tarjeta.appendChild(botonEliminar);

        listaCalculos.appendChild(tarjeta);

    });






})
.catch(function (error) {

    console.log("Error al obtener los cálculos:", error);

    listaCalculos.textContent = "No se pudieron cargar los cálculos.";

});
