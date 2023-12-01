-- MySQL dump 10.13  Distrib 8.0.27, for osx10.16 (x86_64)
--
-- Host: localhost    Database: pokemon_api
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for database pokemon_api
CREATE DATABASE IF NOT EXISTS `pokemon_api` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `pokemon_api`;

-- Dumping structure for table pokemon_api.captured_pokemons
CREATE TABLE IF NOT EXISTS `captured_pokemons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `abilities_sequence` text NOT NULL,
  `abilities_name` text NOT NULL,
  `abilities_slot` text NOT NULL,
  `base_experience` int NOT NULL,
  `sprites_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping structure for table pokemon_api.battles
CREATE TABLE IF NOT EXISTS `battles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pokemon_id` int NOT NULL,
  `opponent_id` int NOT NULL,
  `power` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pokemon_id` (`pokemon_id`),
  KEY `opponent_id` (`opponent_id`),
  CONSTRAINT `battles_ibfk_1` FOREIGN KEY (`pokemon_id`) REFERENCES `captured_pokemons` (`id`),
  CONSTRAINT `battles_ibfk_2` FOREIGN KEY (`opponent_id`) REFERENCES `captured_pokemons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table pokemon_api.captured_pokemons: ~1 rows (approximately)
/*!40000 ALTER TABLE `captured_pokemons` DISABLE KEYS */;
INSERT INTO `captured_pokemons` (`id`, `name`, `abilities_sequence`, `abilities_name`, `abilities_slot`, `base_experience`, `sprites_url`) VALUES
	(1, 'charmander', '1,2,3', 'blaze,torrent', '1,2,3', 62, 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/4.svg');
/*!40000 ALTER TABLE `captured_pokemons` ENABLE KEYS */;

-- Dump completed on 2023-11-30  8:00:00
