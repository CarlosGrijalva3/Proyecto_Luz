
/* server.js */

//-------------------- CONEXIÓN Y CONFIGURACIÓN --------------------//

const http = require("node:http");
const conexion = require("./config/database");
// Leer archivos y encontrar rutas.
const fs = require("node:fs");
const path = require("node:path");
// Encriptar contraseñas y generar sesiones.
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");

const puerto = 3000;

// Guardar las sesiones de los usuarios.
const sesiones = new Map();


//-------------------- SERVIDOR --------------------//

const server = http.createServer((request, response) => {

    console.log("Petición recibida:", request.method, request.url);

    // Permitir las peticiones del frontend.
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


    switch (request.method) {


        //-------------------- GET --------------------//
        case "GET": {

            //-------------------- PÁGINA DE PRUEBA //

            if (request.url === "/") {

                response.statusCode = 200;
                response.setHeader("Content-Type", "text/plain; charset=utf-8");
                response.end("hola");

            }


            //-------------------- OBTENER USUARIOS //

            else if (request.url === "/api/usuarios") {

                conexion.query(
                    "SELECT id_usuario, nombre, correo, fecha_creacion FROM usuario",
                    (error, resultados) => {

                        if (error) {

                            console.log(error);

                            response.statusCode = 500;
                            response.setHeader("Content-Type", "text/plain; charset=utf-8");
                            response.end("Error al consultar usuarios");

                            return;

                        }

                        response.statusCode = 200;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify(resultados));

                    }
                );

            }


            //-------------------- INFORMACIÓN DE WIKILUZ //

            else if (request.url === "/api/wikiLuz") {

                // Comprobar la sesión del usuario.
                const autorizacion = request.headers.authorization;

                if (!autorizacion || !autorizacion.startsWith("Bearer ")) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "Debes iniciar sesión para acceder a WikiLuz."
                    }));

                    return;

                }

                // Obtener el token y buscar la sesión.
                const token_sesion = autorizacion.slice(7);
                const datos_sesion = sesiones.get(token_sesion);

                if (!datos_sesion) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "La sesión no existe o ha expirado."
                    }));
                    return;
                }


                // Obtener la información de WikiLuz.
                const rutaJSON = path.join(__dirname, "data", "wikiLuz.json");

                fs.readFile(rutaJSON, "utf8", (error, datos) => {

                    if (error) {

                        console.log("Error al leer wikiLuz.json:", error);

                        response.statusCode = 500;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Error al leer la información de WikiLuz."
                        }));

                        return;

                    }

                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(datos);

                });

            }

            //-------------------- OBTENER CÁLCULOS DEL USUARIO (calculos_iluminacion)//
            else if (request.url === "/api/calculos") {

                // Comprobar la sesión del usuario.
                const autorizacion = request.headers.authorization;

                if (!autorizacion || !autorizacion.startsWith("Bearer ")) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "No hay una sesión válida."
                    }));

                    return;

                }


                // Obtener el token y buscar la sesión.
                const token_sesion = autorizacion.slice(7);
                const datos_sesion = sesiones.get(token_sesion);

                if (!datos_sesion) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "La sesión no existe o ha expirado."
                    }));

                    return;

                }


                // Buscar los cálculos del usuario en MySQL.
                const sql = "SELECT id_calculo, espacio, lux, area, lumenes_total, fecha_calculo FROM calculos_iluminacion WHERE id_usuario = ? ORDER BY fecha_calculo DESC";

                conexion.query(sql, [datos_sesion.id_usuario], (error, resultados) => {

                    if (error) {

                        console.log(error);

                        response.statusCode = 500;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Error al consultar los cálculos."
                        }));

                        return;

                    }


                    // Enviar los cálculos al navegador.
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify(resultados));

                });

            }




            //-------------------- PERFIL DEL USUARIO //

            else if (request.url === "/api/perfil") {

                const autorizacion = request.headers.authorization;

                if (!autorizacion || !autorizacion.startsWith("Bearer ")) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "No hay una sesión válida."
                    }));

                    return;

                }

                const token_sesion = autorizacion.slice(7);
                const datos_sesion = sesiones.get(token_sesion);

                if (!datos_sesion) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "La sesión no existe o ha expirado."
                    }));

                    return;

                }

                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(JSON.stringify({
                    mensaje: "Sesión válida.",
                    usuario: datos_sesion
                }));

            }


            //-------------------- RUTA NO ENCONTRADA //

            else {

                response.statusCode = 404;
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(JSON.stringify({
                    mensaje: "Ruta no encontrada."
                }));

            }

            break;

        }


        //-------------------- POST --------------------//
        case "POST": {

            //-------------------- REGISTRAR USUARIO //

            if (request.url === "/api/usuarios") {

                let cuerpo = "";

                // Recibir los datos enviados por el navegador.
                request.on("data", (info) => {
                    cuerpo += info.toString();
                });

                request.on("end", () => {

                    let objeto_usuario;

                    // Comprobar que los datos recibidos sean JSON válido.
                    try {

                        objeto_usuario = JSON.parse(cuerpo);

                    } catch (error) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Los datos recibidos no son válidos."
                        }));

                        return;

                    }


                    // Comprobar que recibimos un objeto válido.
                    if (
                        !objeto_usuario ||
                        typeof objeto_usuario !== "object" ||
                        Array.isArray(objeto_usuario)
                    ) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Los datos recibidos no son válidos."
                        }));

                        return;

                    }


                    // Comprobar los datos obligatorios.
                    if (
                        typeof objeto_usuario.nombre !== "string" ||
                        typeof objeto_usuario.correo !== "string" ||
                        typeof objeto_usuario.contrasena !== "string" ||
                        !objeto_usuario.nombre.trim() ||
                        !objeto_usuario.correo.trim() ||
                        !objeto_usuario.contrasena
                    ) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Nombre, correo y contraseña son obligatorios."
                        }));

                        return;

                    }


                    // Generar el hash de la contraseña.
                    bcrypt.hash(objeto_usuario.contrasena, 10, (error, hash) => {

                        if (error) {

                            console.log(error);

                            response.statusCode = 500;
                            response.setHeader("Content-Type", "application/json; charset=utf-8");
                            response.end(JSON.stringify({
                                mensaje: "Error al generar el hash de la contraseña."
                            }));

                            return;

                        }


                        // Guardar el usuario en MySQL.
                        conexion.query(
                            "INSERT INTO usuario (nombre, correo, contrasena) VALUES (?, ?, ?)",
                            [
                                objeto_usuario.nombre.trim(),
                                objeto_usuario.correo.trim(),
                                hash
                            ],
                            (error, resultado) => {

                                if (error) {

                                    console.log(error);

                                    response.statusCode = 500;
                                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                                    response.end(JSON.stringify({
                                        mensaje: "Error al guardar el usuario."
                                    }));

                                    return;

                                }

                                response.statusCode = 201;
                                response.setHeader("Content-Type", "application/json; charset=utf-8");
                                response.end(JSON.stringify({
                                    mensaje: "El usuario " +
                                        objeto_usuario.nombre +
                                        " ha sido guardado correctamente."
                                }));

                            }
                        );

                    });

                });

            }

            //-------------------- GUARDAR CÁLCULO DE ILUMINACIÓN(calucla_iluminacio) //
            else if(request.url === "/api/calculos") {

                const autorizacion = request.headers.authorization;

                if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
                    response.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
                    response.end(JSON.stringify({ mensaje: "Sesion no valida" }));
                    return;
                }

                const token_sesion = autorizacion.slice(7);
                const datos_sesion = sesiones.get(token_sesion);

                if (!datos_sesion) {
                    response.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
                    response.end(JSON.stringify({ mensaje: "Sesion no valida" }));
                    return;
                }

                let cuerpo = "";

                request.on("data", (parte) => {
                    cuerpo += parte.toString();
                });

                request.on("end", () => {

                    let datos;

                    // Comprobar que los datos recibidos sean JSON válido.
                    try {

                        datos = JSON.parse(cuerpo);

                    } catch (error) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Los datos recibidos no son válidos."
                        }));

                        return;

                    }


                    // Comprobar que recibimos un objeto válido.
                    if (
                        !datos ||
                        typeof datos !== "object" ||
                        Array.isArray(datos)
                    ) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Los datos recibidos no son válidos."
                        }));

                        return;

                    }


                    // Obtener los datos del cálculo.
                    const lux = Number(datos.lux);
                    const area = Number(datos.area);
                    const lumenes_total = lux * area;


                    // Comprobar que los datos del cálculo sean correctos.
                    if (
                        typeof datos.espacio !== "string" ||
                        !datos.espacio.trim() ||
                        !Number.isFinite(lux) ||
                        !Number.isFinite(area) ||
                        lux <= 0 ||
                        area <= 0
                    ) {

                        response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                        response.end(JSON.stringify({
                            mensaje: "Datos del calculo no validos"
                        }));

                        return;

                    }


                    // Guardar el cálculo en MySQL.
                    const sql = "INSERT INTO calculos_iluminacion (id_usuario, espacio, lux, area, lumenes_total) VALUES (?, ?, ?, ?, ?)";

                    conexion.query(sql, [datos_sesion.id_usuario, datos.espacio.trim(), lux, area, lumenes_total], (error, resultado) => {
                        
                        if (error) {

                            response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
                            response.end(JSON.stringify({
                                mensaje: "Error al guardar el calculo"
                            }));

                            return;

                        }

                        response.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
                        response.end(JSON.stringify({
                            mensaje: "Calculo guardado correctamente",
                            id_calculo: resultado.insertId
                        }));

                    });

                });

            }

            //-------------------- INICIAR SESIÓN //

            else if (request.url === "/api/login") {

                let cuerpo = "";

                // Recibir los datos enviados por el navegador.
                request.on("data", (info) => {
                    cuerpo += info.toString();
                });

                request.on("end", () => {

                    let objeto_usuario;

                    // Leer los datos recibidos.
                    try {

                        objeto_usuario = JSON.parse(cuerpo);

                    } catch (error) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Los datos recibidos no son válidos."
                        }));

                        return;

                    }


                    // Comprobar que recibimos un objeto válido.
                    if (
                        !objeto_usuario ||
                        typeof objeto_usuario !== "object" ||
                        Array.isArray(objeto_usuario)
                    ) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Los datos recibidos no son válidos."
                        }));

                        return;

                    }


                    // Obtener el correo y la contraseña.
                    const correo = objeto_usuario.correo;
                    const contrasena = objeto_usuario.contrasena;


                    // Comprobar que llegaron los dos datos.
                    if (
                        typeof correo !== "string" ||
                        typeof contrasena !== "string" ||
                        !correo.trim() ||
                        !contrasena
                    ) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "El correo y la contraseña son obligatorios."
                        }));

                        return;

                    }


                    // Buscar al usuario por su correo.
                    conexion.query(
                        "SELECT id_usuario, nombre, correo, contrasena FROM usuario WHERE correo = ?",
                        [correo.trim()],
                        (error, resultados) => {

                            if (error) {

                                console.log(error);

                                response.statusCode = 500;
                                response.setHeader("Content-Type", "application/json; charset=utf-8");
                                response.end(JSON.stringify({
                                    mensaje: "Error interno del servidor."
                                }));

                                return;

                            }


                            // Si el correo no existe, rechazar el acceso.
                            if (resultados.length === 0) {

                                response.statusCode = 401;
                                response.setHeader("Content-Type", "application/json; charset=utf-8");
                                response.end(JSON.stringify({
                                    mensaje: "Correo o contraseña incorrectos."
                                }));

                                return;

                            }


                            const usuario = resultados[0];

                            // Comparar la contraseña con el hash guardado.
                            bcrypt.compare(contrasena, usuario.contrasena, (error, coincide) => {

                                if (error) {

                                    console.log(error);

                                    response.statusCode = 500;
                                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                                    response.end(JSON.stringify({
                                        mensaje: "Error al comprobar las credenciales."
                                    }));

                                    return;

                                }


                                // Si la contraseña no coincide, rechazar el acceso.
                                if (!coincide) {

                                    response.statusCode = 401;
                                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                                    response.end(JSON.stringify({
                                        mensaje: "Correo o contraseña incorrectos."
                                    }));

                                    return;

                                }


                                // Crear una sesión.
                                const token_sesion = crypto.randomBytes(32).toString("hex");

                                // Guardar los datos del usuario en la sesión.
                                const datos_sesion = {
                                    id_usuario: usuario.id_usuario,
                                    nombre: usuario.nombre,
                                    correo: usuario.correo
                                };

                                // Guardar la sesión en el servidor.
                                sesiones.set(token_sesion, datos_sesion);


                                // Enviar la respuesta al navegador.
                                response.statusCode = 200;
                                response.setHeader("Content-Type", "application/json; charset=utf-8");
                                response.end(JSON.stringify({
                                    mensaje: "Inicio de sesión correcto.",
                                    token: token_sesion,
                                    usuario: datos_sesion
                                }));

                            });

                        }
                    );
                });

            }


            //-------------------- RUTA NO ENCONTRADA //

            else {

                response.statusCode = 404;
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(JSON.stringify({
                    mensaje: "Ruta no encontrada."
                }));

            }

            break;

        }


        //-------------------- PUT --------------------//
        case "PUT": {

            //-------------------- ACTUALIZAR PERFIL //

            if (request.url === "/api/perfil") {

                // Comprobar la sesión del usuario.
                const autorizacion = request.headers.authorization;
                // Authorization: Bearer token

                if (!autorizacion || !autorizacion.startsWith("Bearer ")) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "No hay una sesión válida."
                    }));

                    return;

                }


                // Obtener el token y buscar la sesión.
                const token_sesion = autorizacion.slice(7);
                const datos_sesion = sesiones.get(token_sesion);

                if (!datos_sesion) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "La sesión no existe o ha expirado."
                    }));

                    return;

                }


                // Recibir el nuevo nombre.
                let cuerpo = "";

                request.on("data", (info) => {
                    cuerpo += info.toString();
                });

                request.on("end", () => {

                    let objeto_usuario;

                    // Comprobar que los datos recibidos sean JSON válido.
                    try {

                        objeto_usuario = JSON.parse(cuerpo);

                    } catch (error) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Los datos recibidos no son válidos."
                        }));

                        return;

                    }


                    // Comprobar que recibimos un objeto válido.
                    if (
                        !objeto_usuario ||
                        typeof objeto_usuario !== "object" ||
                        Array.isArray(objeto_usuario)
                    ) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Los datos recibidos no son válidos."
                        }));

                        return;

                    }


                    // Comprobar el nombre recibido.
                    if (
                        typeof objeto_usuario.nombre !== "string" ||
                        !objeto_usuario.nombre.trim()
                    ) {

                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "El nombre es obligatorio."
                        }));

                        return;

                    }


                    const nuevo_nombre = objeto_usuario.nombre.trim();

                    // Actualizar el nombre en la base de datos.
                    conexion.query(
                        "UPDATE usuario SET nombre = ? WHERE id_usuario = ?",
                        [nuevo_nombre, datos_sesion.id_usuario],
                        (error, resultado) => {

                            if (error) {

                                console.log(error);

                                response.statusCode = 500;
                                response.setHeader("Content-Type", "application/json; charset=utf-8");
                                response.end(JSON.stringify({
                                    mensaje: "Error al actualizar el nombre."
                                }));

                                return;

                            }


                            // Actualizar el nombre guardado en las sesiones.
                            for (const datos of sesiones.values()) {

                                if (datos.id_usuario === datos_sesion.id_usuario) {
                                    datos.nombre = nuevo_nombre;
                                }

                            }


                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json; charset=utf-8");
                            response.end(JSON.stringify({
                                mensaje: "Nombre actualizado correctamente.",
                                usuario: datos_sesion
                            }));

                        }
                    );

                });

            }


            //-------------------- RUTA NO ENCONTRADA //

            else {

                response.statusCode = 404;
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(JSON.stringify({
                    mensaje: "Ruta no encontrada."
                }));

            }

            break;

        }


        //-------------------- DELETE --------------------//
        case "DELETE": {

            //-------------------- ELIMINAR CÁLCULO DE ILUMINACIÓN //
            if (request.url.startsWith("/api/calculos/")) {

                // Obtener el identificador del cálculo.
                const partes_url = request.url.split("/");
                const id_calculo = Number(partes_url[3]);

                // Comprobar que el identificador sea válido.
                if (
                    partes_url.length !== 4 ||
                    !Number.isInteger(id_calculo) ||
                    id_calculo <= 0
                ) {

                    response.statusCode = 400;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "El identificador del cálculo no es válido."
                    }));

                    return;

                }


                // Comprobar la sesión del usuario.
                const autorizacion = request.headers.authorization;

                if (!autorizacion || !autorizacion.startsWith("Bearer ")) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "No hay una sesión válida."
                    }));

                    return;

                }


                // Obtener el token y buscar la sesión.
                const token_sesion = autorizacion.slice(7);
                const datos_sesion = sesiones.get(token_sesion);

                if (!datos_sesion) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "La sesión no existe o ha expirado."
                    }));

                    return;

                }


                // Eliminar el cálculo del usuario en MySQL.
                conexion.query(
                    "DELETE FROM calculos_iluminacion WHERE id_calculo = ? AND id_usuario = ?",
                    [id_calculo, datos_sesion.id_usuario],
                    (error, resultado) => {

                        if (error) {

                            console.log(error);

                            response.statusCode = 500;
                            response.setHeader("Content-Type", "application/json; charset=utf-8");
                            response.end(JSON.stringify({
                                mensaje: "Error al eliminar el cálculo."
                            }));

                            return;

                        }


                        // Comprobar si se encontró el cálculo.
                        if (resultado.affectedRows === 0) {

                            response.statusCode = 404;
                            response.setHeader("Content-Type", "application/json; charset=utf-8");
                            response.end(JSON.stringify({
                                mensaje: "No se encontró el cálculo."
                            }));

                            return;

                        }


                        // Enviar la respuesta al navegador.
                        response.statusCode = 200;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "Cálculo eliminado correctamente."
                        }));

                    }
                );

            }

            //-------------------- ELIMINAR PERFIL //

            else if (request.url === "/api/perfil") {

                // Comprobar la sesión del usuario.
                const autorizacion = request.headers.authorization;

                if (!autorizacion || !autorizacion.startsWith("Bearer ")) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "No hay una sesión válida."
                    }));

                    return;

                }


                // Obtener el token y buscar la sesión.
                const token_sesion = autorizacion.slice(7);
                const datos_sesion = sesiones.get(token_sesion);

                if (!datos_sesion) {

                    response.statusCode = 401;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify({
                        mensaje: "La sesión no existe o ha expirado."
                    }));

                    return;

                }


                // Eliminar el usuario de la base de datos.
                conexion.query(
                    "DELETE FROM usuario WHERE id_usuario = ?",
                    [datos_sesion.id_usuario],
                    (error, resultado) => {

                        if (error) {

                            console.log(error);

                            response.statusCode = 500;
                            response.setHeader("Content-Type", "application/json; charset=utf-8");
                            response.end(JSON.stringify({
                                mensaje: "Error al eliminar la cuenta."
                            }));

                            return;

                        }


                        // Eliminar las sesiones del usuario.
                        for (const [token, datos] of sesiones.entries()) {

                            if (datos.id_usuario === datos_sesion.id_usuario) {
                                sesiones.delete(token);
                            }

                        }


                        // Enviar la respuesta al navegador.
                        response.statusCode = 200;
                        response.setHeader("Content-Type", "application/json; charset=utf-8");
                        response.end(JSON.stringify({
                            mensaje: "La cuenta se eliminó correctamente."
                        }));

                    }
                );

            }


            //-------------------- RUTA NO ENCONTRADA //

            else {

                response.statusCode = 404;
                response.setHeader("Content-Type", "application/json; charset=utf-8");
                response.end(JSON.stringify({
                    mensaje: "Ruta no encontrada."
                }));

            }

            break;

        }


        //-------------------- OPTIONS --------------------//

        case "OPTIONS": {

            response.statusCode = 204;
            response.end();

            break;

        }


        //-------------------- MÉTODO NO PERMITIDO --------------------//

        default: {

            response.statusCode = 405;
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify({
                mensaje: "Método no permitido."
            }));

            break;

        }

    }

});


//-------------------- INICIAR SERVIDOR --------------------//

server.listen(puerto, () => {

    console.log(`Servidor ejecutándose en http://localhost:${puerto}`);

});


/*
-------------------- APUNTES --------------------

typeof:
Permite conocer el tipo de dato de una variable.

return:
Detiene una función o devuelve un resultado.

trim():
Quita los espacios al principio y al final de un texto.

response.statusCode:
Indica el estado de la respuesta HTTP.

response.end():
Finaliza la respuesta y puede enviar información.

path.join():
Une partes para formar una ruta de archivo.

__dirname:
Indica la carpeta donde se encuentra server.js.

autorizacion:
Guarda el contenido de la cabecera Authorization.

startsWith():
Comprueba si un texto comienza con otro texto.

Bearer:
Palabra que indica que estamos enviando un token.

slice():
Obtiene una parte de un texto.

sesiones.get():
Busca una sesión utilizando su token.

Array.isArray():
Comprueba si una variable es un arreglo.

JSON.parse():
Convierte un texto JSON en un objeto de JavaScript.

JSON.stringify():
Convierte un objeto de JavaScript en texto JSON.

*/
