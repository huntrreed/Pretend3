CREATE DATABASE IF NOT EXISTS users_db;
USE users_db;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    allowSenior BOOLEAN,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);
CREATE TABLE sessions (
  sid VARCHAR(255) PRIMARY KEY,
  expires TIMESTAMP,
  data TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);