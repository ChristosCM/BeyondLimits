-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bldb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bldb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bldb` DEFAULT CHARACTER SET utf8 ;
USE `bldb` ;

-- -----------------------------------------------------
-- Table `bldb`.`accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bldb`.`accounts` (
  `idAccount` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`idAccount`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bldb`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bldb`.`events` (
  `idEvents` INT(11) NOT NULL AUTO_INCREMENT,
  `eventName` VARCHAR(45) NOT NULL,
  `attendance` INT(11) NULL DEFAULT NULL,
  `volunteerTotal` INT(11) NULL DEFAULT NULL,
  `volunteerMale` INT(11) NULL DEFAULT NULL,
  `volunteerFemale` INT(11) NULL DEFAULT NULL,
  `pPath` VARCHAR(45) NULL DEFAULT NULL,
  `description` VARCHAR(45) NULL DEFAULT NULL,
  `date` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idEvents`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bldb`.`eventsarchive`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bldb`.`eventsarchive` (
  `idEvents` INT(11) NOT NULL AUTO_INCREMENT,
  `eventName` VARCHAR(45) NOT NULL,
  `attendance` INT(11) NULL DEFAULT NULL,
  `volunteerTotal` INT(11) NULL DEFAULT NULL,
  `volunteerMale` INT(11) NULL DEFAULT NULL,
  `volunteerFemale` INT(11) NULL DEFAULT NULL,
  `pPath` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idEvents`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bldb`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bldb`.`posts` (
  `idposts` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `content` VARCHAR(250) NOT NULL,
  `date` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idposts`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bldb`.`testimonials`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bldb`.`testimonials` (
  `idtestimonials` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `content` VARCHAR(250) NOT NULL,
  `photo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idtestimonials`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bldb`.`volunteer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bldb`.`volunteer` (
  `idVolunteer` INT(11) NOT NULL AUTO_INCREMENT,
  `First Name` VARCHAR(45) NOT NULL,
  `Surname` VARCHAR(45) NOT NULL,
  `Sex` CHAR(1) NOT NULL,
  `Age` INT(11) NOT NULL,
  `OriginPlace` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idVolunteer`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `bldb`.`volunteerevents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bldb`.`volunteerevents` (
  `idEvents` INT(11) NOT NULL,
  `idVolunteer` INT(11) NOT NULL,
  PRIMARY KEY (`idEvents`, `idVolunteer`),
  INDEX `idVolunteer_idx` (`idVolunteer` ASC) VISIBLE,
  CONSTRAINT `idEvent`
    FOREIGN KEY (`idEvents`)
    REFERENCES `bldb`.`events` (`idEvents`),
  CONSTRAINT `idVolunteer`
    FOREIGN KEY (`idVolunteer`)
    REFERENCES `bldb`.`volunteer` (`idVolunteer`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
