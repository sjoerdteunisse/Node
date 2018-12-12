DROP DATABASE IF EXISTS `nodedb`;
CREATE DATABASE `nodedb`;
USE `nodedb`;

-- gamedb_user aanmaken
CREATE USER 'nodeDB_user'@'%' IDENTIFIED BY 'secret';
CREATE USER 'nodeDB_user'@'localhost' IDENTIFIED BY 'secret';

-- geef in een keer alle rechten - soort administrator!
GRANT ALL ON `nodedb`.* TO 'nodeDB_user'@'%';
GRANT ALL ON `nodedb`.* TO 'nodeDB_user'@'localhost';

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;
CREATE TABLE IF NOT EXISTS `users` (
	`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`firstname` VARCHAR(32) NOT NULL,
	`lastname` VARCHAR(64) NOT NULL,
	`email` VARCHAR(64) NOT NULL UNIQUE,
	`password` VARCHAR(32) NOT NULL,
	`lastupdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`) 
VALUES ('user-1', 'name-1', 'user1@server.nl', 'secret')