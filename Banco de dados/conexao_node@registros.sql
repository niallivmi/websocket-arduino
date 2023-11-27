-- MySQLShell dump 2.0.1  Distrib Ver 8.0.33 for Win64 on x86_64 - for MySQL 8.0.33 (MySQL Community Server (GPL)), for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: conexao_node    Table: registros
-- ------------------------------------------------------
-- Server version	8.0.33

--
-- Table structure for table `registros`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `registros` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ID_BOTÃO` varchar(255) DEFAULT NULL,
  `COMANDO` varchar(255) DEFAULT NULL,
  `HORÁRIO` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
