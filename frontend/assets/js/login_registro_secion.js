"use strict";

const formularioDeSesion = document.getElementById("inicioSesion");
const correoDeSesion = document.getElementById("loginCorreo");
const contrasenaDeSesion = document.getElementById("loginContrasena");
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
        headers: { "Content-Type": "application/json" },
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
    .then(function (resultado) {
        mensajeRespuestaSesion.textContent = resultado.datos.mensaje;

        if (resultado.correcto) {
            sessionStorage.setItem("token_sesion", resultado.datos.token);
            console.log("Token guardado:", sessionStorage.getItem("token_sesion"));
            console.log("Usuario autenticado:", resultado.datos.usuario);

            setTimeout(function () {
                window.location.href = "wikiLuz.html";
            }, 1300);
        }
    })
    .catch(function (error) {
        console.log("Error:", error);
        mensajeRespuestaSesion.textContent = "No se pudo conectar con el servidor.";
    });
});