DROP DATABASE IF EXISTS `nodedb_test`;
CREATE DATABASE `nodedb_test`;
USE `nodedb_test`;

CREATE USER 'nodeDB_test_user'@'%' IDENTIFIED BY 'secret';
CREATE USER 'nodeDB_test_user'@'localhost' IDENTIFIED BY 'secret';

GRANT ALL ON `nodedb_test`.* TO 'nodeDB_test_user'@'%';
GRANT ALL ON `nodedb_test`.* TO 'nodeDB_test_user'@'localhost';

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users` ;
CREATE TABLE IF NOT EXISTS `users` (
	`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`firstname` VARCHAR(32) NOT NULL,
	`lastname` VARCHAR(64) NOT NULL,
	`email` VARCHAR(64) NOT NULL UNIQUE,
	`password` VARCHAR(128) NOT NULL,
	`lastupdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`ID`)
) 
ENGINE = InnoDB;

INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`) 
VALUES ('user-1', 'name-1', 'user1@server.nl', 'secret')