"use strict";

// 1. ELEMENTOS DEL FORMULARIO DE REGISTRO. ---//
const formulario = document.getElementById("registro");
const btnEnviar = document.getElementById("btnEnviar");

const nombreInput = document.querySelector("input[name='nombre']");
const correoInput = document.querySelector("input[name='correo']");
const contrasenaInput = document.querySelector("input[name='contrasena']");

const errorNombre = document.getElementById("error-nombre");
const errorCorreo = document.getElementById("error-correo");
const errorContrasena = document.getElementById("error-contrasena");

const mensajeGlobal = document.getElementById("mensajeGlobal");

// 2. ELEMENTOS DEL FORMULARIO DE INICIO DE SESIÓN. ---//
const formularioLogin = document.getElementById("inicioSesion");
const mostrarLogin = document.getElementById("mostrarLogin");
const mostrarRegistro = document.getElementById("mostrarRegistro");
const mensajeLogin = document.getElementById("mensajeLogin");
const contenedorFormularios = document.getElementById("contenedorFormularios");

// 3. LIMPIAR ERRORES. ---//
function limpiarErrores() {
    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorContrasena.textContent = "";
    mensajeGlobal.textContent = "";
}

// 4. VALIDACIONES. ---//
function validarNombre(nombre) {
    if (nombre === "") {
        errorNombre.textContent = "El nombre es obligatorio.";
        return false;
    }

    if (nombre.length < 8 || nombre.length > 30) {
        errorNombre.textContent = "El nombre debe tener entre 8 y 30 caracteres.";
        return false;
    }

    if (/\s/.test(nombre)) {
        errorNombre.textContent = "El nombre no debe contener espacios.";
        return false;
    }

    errorNombre.textContent = "";
    return true;
}

function validarCorreo(correo) {
    if (correo === "") {
        errorCorreo.textContent = "El correo es obligatorio.";
        return false;
    }

    if (correo.length < 5 || correo.length > 150) {
        errorCorreo.textContent = "El correo debe tener entre 5 y 150 caracteres.";
        return false;
    }

    const formatoCorreo = /^[a-zA-Z0-9._+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formatoCorreo.test(correo)) {
        errorCorreo.textContent = "Escribe un correo electrónico válido.";
        return false;
    }

    errorCorreo.textContent = "";
    return true;
}

function validarContrasena(contrasena) {
    if (contrasena === "") {
        errorContrasena.textContent = "La contraseña es obligatoria.";
        return false;
    }

    if (contrasena.length < 6 || contrasena.length > 30) {
        errorContrasena.textContent = "La contraseña debe tener entre 6 y 30 caracteres.";
        return false;
    }

    if (/\s/.test(contrasena)) {
        errorContrasena.textContent = "La contraseña no debe contener espacios.";
        return false;
    }

    if (!/[A-Z]/.test(contrasena)) {
        errorContrasena.textContent = "La contraseña debe tener al menos una letra mayúscula.";
        return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]~+=;]/.test(contrasena)) {
        errorContrasena.textContent = "La contraseña debe tener al menos un carácter especial.";
        return false;
    }

    errorContrasena.textContent = "";
    return true;
}

// 5. VALIDAR TODO EL FORMULARIO. ---//
function validarFormulario() {
    limpiarErrores();

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const contrasena = contrasenaInput.value;

    const nombreValido = validarNombre(nombre);
    const correoValido = validarCorreo(correo);
    const contrasenaValida = validarContrasena(contrasena);

    return nombreValido && correoValido && contrasenaValida;
}

// 6. VALIDACIONES EN TIEMPO REAL. ---//
nombreInput.addEventListener("input", function () {
    validarNombre(nombreInput.value.trim());
});

correoInput.addEventListener("input", function () {
    validarCorreo(correoInput.value.trim());
});

contrasenaInput.addEventListener("input", function () {
    validarContrasena(contrasenaInput.value);
});

// 7. ENVÍO DEL FORMULARIO DE REGISTRO. ---//
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const valido = validarFormulario();

    if (!valido) {
        console.log("Formulario inválido.");
        return;
    }

    console.log("Formulario válido");
    btnEnviar.disabled = true;

    const nombreRegistrado = nombreInput.value.trim() + " registrado";

    fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombreInput.value.trim(),
            correo: correoInput.value.trim(),
            contrasena: contrasenaInput.value
        })
    })
    .then(function (response) {
        if (response.ok) {
            return response.text().then(function () {
                formulario.reset();
                limpiarErrores();

                formulario.hidden = true;
                formularioLogin.hidden = false;
                contenedorFormularios.classList.add("inicio-sesion");

                mensajeLogin.textContent = nombreRegistrado;
                setTimeout(function () {
                    mensajeLogin.textContent = "";
                }, 90000);
            });
        }

        return response.text().then(function (mensaje) {
            mensajeGlobal.textContent = mensaje;
        });
    })
    .then(function () {
        btnEnviar.disabled = false;
    });
});

// 8. MOSTRAR EL FORMULARIO DE INICIO DE SESIÓN. ---//
mostrarLogin.addEventListener("click", function () {
    formulario.hidden = true;
    formularioLogin.hidden = false;
    contenedorFormularios.classList.add("inicio-sesion");
    mensajeLogin.textContent = "";
});

// 9. VOLVER AL FORMULARIO DE REGISTRO. ---//
mostrarRegistro.addEventListener("click", function () {
    formularioLogin.hidden = true;
    formulario.hidden = false;
    contenedorFormularios.classList.remove("inicio-sesion");
    mensajeGlobal.textContent = "";
    mensajeLogin.textContent = "";
});