CREATE DATABASE  IF NOT EXISTS `access_members` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `access_members`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: access_members
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `totalPrice` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('Active','Sealed','Abandoned') NOT NULL DEFAULT 'Active',
  `eventId` int DEFAULT NULL,
  `createdById` int DEFAULT NULL,
  `sealingOrderId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_4d03548f24da1ee603749357ed` (`sealingOrderId`),
  KEY `FK_c3c2a308df1213d6e4fc89d12e5` (`eventId`),
  KEY `FK_eaca17862ea338f633669c95211` (`createdById`),
  CONSTRAINT `FK_4d03548f24da1ee603749357ed2` FOREIGN KEY (`sealingOrderId`) REFERENCES `order` (`id`),
  CONSTRAINT `FK_c3c2a308df1213d6e4fc89d12e5` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`),
  CONSTRAINT `FK_eaca17862ea338f633669c95211` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `date` timestamp NOT NULL,
  `status` enum('Draft','ReadyForListing','Listed','SoldOut','Cancelled','Completed') NOT NULL DEFAULT 'Draft',
  `originalTicketsQuantity` int NOT NULL DEFAULT '0',
  `availableTicketsQuantity` int NOT NULL DEFAULT '0',
  `templateId` int DEFAULT NULL,
  `createdById` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3cf56ec9a279382cceb4015ec37` (`templateId`),
  KEY `FK_1d5a6b5f38273d74f192ae552a6` (`createdById`),
  CONSTRAINT `FK_1d5a6b5f38273d74f192ae552a6` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_3cf56ec9a279382cceb4015ec37` FOREIGN KEY (`templateId`) REFERENCES `event_template` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_template`
--

DROP TABLE IF EXISTS `event_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_template` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `createdById` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a2d7410758bdc0e9a0772224c64` (`createdById`),
  CONSTRAINT `FK_a2d7410758bdc0e9a0772224c64` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_template`
--

LOCK TABLES `event_template` WRITE;
/*!40000 ALTER TABLE `event_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('Created','Completed','Cancelled') NOT NULL DEFAULT 'Created',
  `eventId` int DEFAULT NULL,
  `createdById` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b76e4eedb99633c207ab48cdd3e` (`eventId`),
  KEY `FK_de6fa8b07fd7e0a8bf9edb5eb38` (`createdById`),
  CONSTRAINT `FK_b76e4eedb99633c207ab48cdd3e` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`),
  CONSTRAINT `FK_de6fa8b07fd7e0a8bf9edb5eb38` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_item`
--

DROP TABLE IF EXISTS `purchase_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `itemType` enum('Ticket') NOT NULL,
  `itemId` int NOT NULL,
  `quantity` int NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `cartId` int DEFAULT NULL,
  `orderId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_1c73db31469f4c65a0a20fb263a` (`cartId`),
  KEY `FK_aae30057bada845801563e05cb9` (`orderId`),
  CONSTRAINT `FK_1c73db31469f4c65a0a20fb263a` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`),
  CONSTRAINT `FK_aae30057bada845801563e05cb9` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_item`
--

LOCK TABLES `purchase_item` WRITE;
/*!40000 ALTER TABLE `purchase_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'2025-03-16 03:53:30.256264','2025-03-16 03:53:30.256264','User');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_tag`
--

DROP TABLE IF EXISTS `role_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7837a148918ced2479765c70ca` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_tag`
--

LOCK TABLES `role_tag` WRITE;
/*!40000 ALTER TABLE `role_tag` DISABLE KEYS */;
INSERT INTO `role_tag` VALUES (1,'2025-03-16 03:53:32.337777','2025-03-16 03:53:32.337777','Attendee'),(2,'2025-03-16 03:53:32.337777','2025-03-16 03:53:32.337777','Organizer');
/*!40000 ALTER TABLE `role_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `type` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `originalQuantity` int NOT NULL,
  `availableQuantity` int NOT NULL,
  `status` enum('Available','SoldOut') NOT NULL DEFAULT 'Available',
  `eventId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_479ac423d0431340df7066780e` (`eventId`,`type`),
  CONSTRAINT `FK_cb22a51617991265571be41b74f` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_ledger`
--

DROP TABLE IF EXISTS `ticket_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_ledger` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `previousBalance` int NOT NULL,
  `balanceChange` int NOT NULL,
  `operation` enum('+','-') NOT NULL,
  `newBalance` int NOT NULL,
  `eventId` int DEFAULT NULL,
  `ticketId` int DEFAULT NULL,
  `orderId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_39d659ac48ece2cd46d1f9ffc80` (`eventId`),
  KEY `FK_0e2e05a7783cfbfd67d23651427` (`ticketId`),
  KEY `FK_a88b019c96b95a8b2e7df19a366` (`orderId`),
  CONSTRAINT `FK_0e2e05a7783cfbfd67d23651427` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`id`),
  CONSTRAINT `FK_39d659ac48ece2cd46d1f9ffc80` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`),
  CONSTRAINT `FK_a88b019c96b95a8b2e7df19a366` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_ledger`
--

LOCK TABLES `ticket_ledger` WRITE;
/*!40000 ALTER TABLE `ticket_ledger` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_price_history`
--

DROP TABLE IF EXISTS `ticket_price_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_price_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `price` decimal(10,2) NOT NULL,
  `validFrom` timestamp NOT NULL,
  `validTo` timestamp NULL DEFAULT NULL,
  `ticketId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_84fc259949b8a0419ad6d89ef57` (`ticketId`),
  CONSTRAINT `FK_84fc259949b8a0419ad6d89ef57` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_price_history`
--

LOCK TABLES `ticket_price_history` WRITE;
/*!40000 ALTER TABLE `ticket_price_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_price_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `type` enum('Payment') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `sourceType` enum('VAccount','Card') NOT NULL,
  `source` varchar(255) NOT NULL,
  `destType` enum('VAccount','Card') NOT NULL,
  `dest` varchar(255) NOT NULL,
  `status` enum('Processing','Completed','Failed') NOT NULL,
  `referenceType` varchar(255) NOT NULL,
  `referenceId` int NOT NULL,
  `externalTransactionId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_644236c95ad922bc9e30c39aa2` (`referenceId`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  KEY `FK_c28e52f758e7bbc53828db92194` (`roleId`),
  CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role_tags_role_tag`
--

DROP TABLE IF EXISTS `user_role_tags_role_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role_tags_role_tag` (
  `userId` int NOT NULL,
  `roleTagId` int NOT NULL,
  PRIMARY KEY (`userId`,`roleTagId`),
  KEY `IDX_955d2586cc5eae1ea7d45431f6` (`userId`),
  KEY `IDX_62982783e58de93e97ca30e858` (`roleTagId`),
  CONSTRAINT `FK_62982783e58de93e97ca30e858e` FOREIGN KEY (`roleTagId`) REFERENCES `role_tag` (`id`),
  CONSTRAINT `FK_955d2586cc5eae1ea7d45431f6d` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role_tags_role_tag`
--

LOCK TABLES `user_role_tags_role_tag` WRITE;
/*!40000 ALTER TABLE `user_role_tags_role_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_role_tags_role_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `v_account`
--

DROP TABLE IF EXISTS `v_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `v_account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `viban` varchar(255) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `entityType` enum('User','Event') NOT NULL,
  `entityId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e2564a896f88aba6b80e817fc7` (`viban`),
  UNIQUE KEY `IDX_4f3175b1030fa3c4cc012dfe7f` (`entityId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `v_account`
--

LOCK TABLES `v_account` WRITE;
/*!40000 ALTER TABLE `v_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `v_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `v_account_ledger`
--

DROP TABLE IF EXISTS `v_account_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `v_account_ledger` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `previousBalance` decimal(10,2) NOT NULL,
  `balanceChange` decimal(10,2) NOT NULL,
  `operation` enum('+','-') NOT NULL,
  `newBalance` decimal(10,2) NOT NULL,
  `vaccountId` int DEFAULT NULL,
  `transactionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ec170dccd8563cdafb1795ec28e` (`vaccountId`),
  KEY `FK_59403385b44fe48f56e786a6908` (`transactionId`),
  CONSTRAINT `FK_59403385b44fe48f56e786a6908` FOREIGN KEY (`transactionId`) REFERENCES `transaction` (`id`),
  CONSTRAINT `FK_ec170dccd8563cdafb1795ec28e` FOREIGN KEY (`vaccountId`) REFERENCES `v_account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `v_account_ledger`
--

LOCK TABLES `v_account_ledger` WRITE;
/*!40000 ALTER TABLE `v_account_ledger` DISABLE KEYS */;
/*!40000 ALTER TABLE `v_account_ledger` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-16  5:54:53
