const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "proyecto_luz_web_db"
});

conexion.connect((error) => {
    if (error) {
        console.log("Error de conexión:", error);
        return;
    }

    console.log("Conexión a MySQL exitosa");
});

module.exports = conexion;//otro archivo pueda utilizar esa conexión.