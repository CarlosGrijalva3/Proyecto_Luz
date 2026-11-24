-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-11-2026 a las 18:45:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_luz_web_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `correo`, `contrasena`, `fecha_creacion`) VALUES
(1, 'CarlosTest', 'carlos@test.com', 'Prueba1!', '2026-10-06 23:42:40'),
(2, 'CarlosHash', 'carloshash@test.com', '$2b$10$QddzWtLvmsbTU7qpNQur6epuFIp8PoAfuTBjpJ3p0L3vg3cVsmtUS', '2026-10-07 00:02:02'),
(6, 'CarlosHash', 'carloshash@testt.com', '$2b$10$qLNIeJXQUAHv68yIms.lC.6oSEV5cuwb0vEuMqcFXEFcmOwTxt9lq', '2026-10-07 00:27:54'),
(16, 'aguaMineral', 'agua@gmail.com', '$2b$10$Ux5lXBPDPGlJlacin/WL7.08xORfxLe41ia0o28c71ED/oEeZYk4a', '2026-10-20 15:50:54'),
(17, 'MisaSalinas', 'MisaSalinas@gmail.com', '$2b$10$gbLieMr17tLeE0lJ6VX8..ZFcJuvZ5B.gOTUnPQYPuVSQ/fy368lW', '2026-10-25 21:39:56'),
(18, 'Wawawawa', 'Wawawawa@gmail.com', '$2b$10$hi9YG2nUVxudph.HR1x/ZOiMHD0JR3LEphX5JJ.fVrzUZbrSOM0ai', '2026-10-26 00:25:02'),
(19, 'Elmatador', 'Elmatador@gmail.com', '$2b$10$AEm0bK1pbLMleo4i4cVnpOAtaXNIwC6intz/keWJ7thzzSzKj9laq', '2026-10-26 00:34:17'),
(20, 'ElMostacho', 'ElMostacho@gmail.com', '$2b$10$tgFMM7VN5m/XQFcBvO4B5.rJ1PvMgJ2kCZPHT42dNQKiMSG4ZXzti', '2026-10-26 00:40:21'),
(21, 'DrMilanesa', 'DrMilanesa@gmail.com', '$2b$10$nzs.58on2cMw5OBpxXPOfeUu9HVtpI.cspvH0rdfhBIer/Is1oEfm', '2026-10-27 14:40:59'),
(24, 'Carlos123', 'Carlos123@gmail.com', '$2b$10$YVW/OoruuGx/9AO8mvhxj.WNqQQiRE1QaPxafgxa6N1Py1IARp7F6', '2026-11-13 00:14:06');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
