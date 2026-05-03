-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_db;

-- Use the newly created database
USE school_db;

-- Create the schools table
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
