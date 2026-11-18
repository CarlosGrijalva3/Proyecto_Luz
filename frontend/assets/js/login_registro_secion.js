"use strict";
// login_registro_registro.js


// FORMULARIO 
const formularioDeSesion = document.getElementById("inicioSesion");
const correoDeSesion = document.getElementById("loginCorreo");
const contrasenaDeSesion = document.getElementById("loginContrasena");
//const mensajeLogin = document.getElementById("mensajeLogin");
const mensajeRespuestaSesion = document.getElementById("mensajeLogin");

formularioDeSesion.addEventListener("submit", function (evento) {
    console.log("Se detectó el envío del formulario");
    
    evento.preventDefault();

    const datosUsuario = {
        correo: correoDeSesion.value.trim(),
        contrasena: contrasenaDeSesion.value
    };

    mensajeRespuestaSesion.textContent = "Comprobando datos...";
    console.log("Enviando datos al servidor...");
    fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(datosUsuario)
    })
    .then(function (respuesta) {
        return respuesta.json().then(function (datos) {
            return {
                correcto: respuesta.ok,
                datos: datos
            };
        });
    })

    /*
    .then(function (resultado) {
        mensajeRespuestaSesion.textContent = resultado.datos.mensaje;

            if (resultado.correcto) {
            console.log("Usuario autenticado:", resultado.datos.usuario);
            
            //window.location.href = "wikiLuz.html";
            setTimeout(function () {
                window.location.href = "wikiLuz.html";
            }, 1300);
        }
    })
    */
   .then(function (resultado) {
    mensajeRespuestaSesion.textContent = resultado.datos.mensaje;

    if (resultado.correcto) {

        // Guardar el identificador de sesión.
        sessionStorage.setItem(
            "token_sesion",
            resultado.datos.token
        );
        console.log("Token guardado:", sessionStorage.getItem("token_sesion"));
        console.log("Usuario autenticado:", resultado.datos.usuario);

        // Entrar a WikiLuz.
        setTimeout(function () {
            window.location.href = "wikiLuz.html";
        }, 1300);
    }
    })


    .catch(function (error) {
        console.log("Error:", error);
        mensajeRespuestaSesion.textContent =
            "No se pudo conectar con el servidor.";
    });
});


/*
//LEER EL FORMULARIO DE REGISTRO
const formulario = document.getElementById("registro");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.querySelector("input[name='nombre']").value;
    const correo = document.querySelector("input[name='correo']").value;
    const contrasena = document.querySelector("input[name='contrasena']").value;
    //const terminos = document.querySelector("input[name='terminos']").checked;

    console.log("Nombre:", nombre);
    console.log("Correo:", correo);
    console.log("Contraseña:", contrasena);
    //console.log("Términos aceptados:", terminos);
});
*/




//--------------------------------------old------------------------
/*
const formLogin = document.querySelector("#form-login");
const mensajeGlobal = document.getElementById("mensajeGlobal");
const loading = document.getElementById("loading");
const btnEnviar = document.getElementById("btnEnviar");

// Reinicia el estado del formulario al cargar o al regresar con el botón "Atrás"
window.addEventListener("pageshow", () => {
    if (formLogin) formLogin.reset();
    if (mensajeGlobal) mensajeGlobal.textContent = "";
    if (loading) loading.style.display = "none";
    if (btnEnviar) btnEnviar.disabled = false;
});

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (loading) loading.style.display = "block";
        if (btnEnviar) btnEnviar.disabled = true;
        if (mensajeGlobal) mensajeGlobal.textContent = "";

        try {
            const formData = new FormData(formLogin);
            const urlPHP = formLogin.getAttribute("action") || "../config/iniciar_sesion.php";

            const response = await fetch(urlPHP, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (loading) loading.style.display = "none";

            if (data.status === "success") {
                mensajeGlobal.style.color = "#28a745";
                mensajeGlobal.textContent = data.mensaje;
                
                setTimeout(() => {
                    // Asegúrate de que hola_mundo.html exista en la carpeta correspondiente
                    window.location.href = "hola_mundo.html"; // O "../hola_mundo.html" si está en la raíz
                }, 1000);
            } else {
                if (btnEnviar) btnEnviar.disabled = false;
                mensajeGlobal.style.color = "#f0a6a6";
                mensajeGlobal.textContent = data.mensaje;
            }
        } catch (error) {
            if (loading) loading.style.display = "none";
            if (btnEnviar) btnEnviar.disabled = false;
            
            mensajeGlobal.style.color = "#f0a6a6";
            mensajeGlobal.textContent = "Error de comunicación con el servidor.";
            console.error("Detalle del error:", error);
        }
    });
}
*/