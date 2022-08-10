DROP DATABASE IF EXISTS ucode_reg;

CREATE DATABASE IF NOT EXISTS ucode_reg;

-- CREATE USER 'mhrynenko'@'localhost' IDENTIFIED BY 'securepass';

GRANT ALL PRIVILEGES ON ucode_reg. * TO 'mhrynenko'@'localhost';

FLUSH PRIVILEGES;

USE ucode_reg;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('admin','user') NOT NULL
);

CREATE TABLE IF NOT EXISTS heroes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL,
    healthpoints INT NOT NULL,
    damage INT NOT NULL,
    rarity INT NOT NULL,
    image VARCHAR(256) NOT NULL
);