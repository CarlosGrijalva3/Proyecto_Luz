-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-11-2026 a las 18:45:16
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
-- Estructura de tabla para la tabla `calculos_iluminacion`
--

CREATE TABLE `calculos_iluminacion` (
  `id_calculo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `espacio` varchar(100) NOT NULL,
  `lux` int(11) NOT NULL,
  `area` decimal(10,2) NOT NULL,
  `lumenes_total` decimal(12,2) NOT NULL,
  `fecha_calculo` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calculos_iluminacion`
--

INSERT INTO `calculos_iluminacion` (`id_calculo`, `id_usuario`, `espacio`, `lux`, `area`, `lumenes_total`, `fecha_calculo`) VALUES
(2, 24, 'Jardín', 75, 50.00, 3750.00, '2026-11-14 22:25:30');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calculos_iluminacion`
--
ALTER TABLE `calculos_iluminacion`
  ADD PRIMARY KEY (`id_calculo`),
  ADD KEY `idx_id_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calculos_iluminacion`
--
ALTER TABLE `calculos_iluminacion`
  MODIFY `id_calculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calculos_iluminacion`
--
ALTER TABLE `calculos_iluminacion`
  ADD CONSTRAINT `fk_calculos_iluminacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
