USE `faceid`;
CREATE TABLE `users` (
  `id` varchar(300) NOT NULL,
  `nome` varchar(145) DEFAULT NULL,
  `registro` varchar(45) DEFAULT NULL,
  `email` varchar(245) DEFAULT NULL,
  `senha` text,
  `last_attempt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `faces` (
  `id` varchar(300) NOT NULL,
  `idusers` varchar(300) DEFAULT NULL,
  `faces` longtext,
  KEY `fk_faces_idx` (`idusers`)
);


