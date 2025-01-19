-- ---------- Criação da base de dados ---------- --
CREATE DATABASE IF NOT EXISTS projetoredes;
USE projetoredes;

-- ---------- Criação das tabelas ---------- --
CREATE TABLE IF NOT EXISTS users (
  email VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  experience INT,
  level INT,
  profilePicture MEDIUMBLOB
);

CREATE TABLE IF NOT EXISTS groups_ (  
  groupId INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  description VARCHAR(1024) NOT NULL,
  image MEDIUMBLOB
);

CREATE TABLE IF NOT EXISTS messages (
  messageId INT PRIMARY KEY AUTO_INCREMENT,
  userSenderEmail VARCHAR(255),
  originGroupId INT NOT NULL,
  content TEXT NOT NULL,
  sendDate DATETIME,
  FOREIGN KEY (originGroupId) REFERENCES groups_(groupId),
  FOREIGN KEY (userSenderEmail) REFERENCES users(email)
);

CREATE TABLE IF NOT EXISTS tasks (
  taskId INT PRIMARY KEY AUTO_INCREMENT,
  originGroupId INT NOT NULL,
  description TEXT,
  reward INT,
  createDate DATETIME,
  FOREIGN KEY (originGroupId) REFERENCES groups_(groupId)
);

CREATE TABLE IF NOT EXISTS groupUsers (
  userEmail VARCHAR(255),
  groupId INT NOT NULL,
  position VARCHAR(255),
  PRIMARY KEY (userEmail, groupId),
  FOREIGN KEY (userEmail) REFERENCES users(email),
  FOREIGN KEY (groupId) REFERENCES groups_(groupId)
);

CREATE TABLE IF NOT EXISTS taskAssignment (
  assignedUser VARCHAR(255),
  taskId INT NOT NULL,
  concluded BOOLEAN,
  PRIMARY KEY (assignedUser, taskId),
  FOREIGN KEY (assignedUser) REFERENCES users(email),
  FOREIGN KEY (taskId) REFERENCES tasks(taskId)
);

-- ---------- Concedendo acessos ---------- --
CREATE USER IF NOT EXISTS 'mysql-container'@'%' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON projetoredes.* TO 'mysql-container'@'%';

FLUSH PRIVILEGES;