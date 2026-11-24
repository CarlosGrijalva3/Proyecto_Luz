// ../assets/js/luciernagas.js
"use strict";

(function () {
    const contenedor = document.getElementById("fondo-luciernagas");
    if (!contenedor) {
        return;
    }

    const cantidad = 110;

    for (let i = 0; i < cantidad; i++) {
        const bolita = document.createElement("span");
        bolita.className = "luciernaga-bolita";

        const tamano = Math.floor(Math.random() * 15) + 5; // 5px a 19px
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const dx = (Math.random() * 48 - 24).toFixed(1) + "px";
        const dy = (Math.random() * 48 - 24).toFixed(1) + "px";
        const duracion = (Math.random() * 10 + 10).toFixed(1) + "s";
        const parpadeo = (Math.random() * 4 + 3.5).toFixed(1) + "s";
        const retraso = (Math.random() * -8).toFixed(1) + "s";

        bolita.style.width = tamano + "px";
        bolita.style.height = tamano + "px";
        bolita.style.left = posX + "%";
        bolita.style.top = posY + "%";
        bolita.style.setProperty("--dx", dx);
        bolita.style.setProperty("--dy", dy);
        bolita.style.setProperty("--duracion", duracion);
        bolita.style.setProperty("--parpadeo", parpadeo);
        bolita.style.animationDelay = retraso + ", " + retraso;

        contenedor.appendChild(bolita);
    }
})();