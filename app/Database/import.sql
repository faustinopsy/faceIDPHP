USE `faceid`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(145) DEFAULT NULL,
  `registro` varchar(45) DEFAULT NULL,
  `email` varchar(245) DEFAULT NULL,
  `senha` text,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `faces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idusers` int DEFAULT NULL,
  `faces` mediumtext,
  PRIMARY KEY (`id`),
  KEY `fk_faces_idx` (`idusers`),
  CONSTRAINT `fk_faces` FOREIGN KEY (`idusers`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;
