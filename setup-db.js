require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('Connecting to Aiven MySQL...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      // We don't specify the database here initially just in case it doesn't exist, 
      // but Aiven gives you 'defaultdb' by default. We will connect to it directly.
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false // Required for Aiven connections
      }
    });

    console.log('Connected successfully!');
    
    // Create the schools table
    console.log('Creating schools table...');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      );
    `;
    
    await connection.execute(createTableQuery);
    console.log('✅ Table "schools" created successfully!');

    await connection.end();
    console.log('Database setup complete. You can now start the server with "npm start".');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.message.includes('Access denied')) {
      console.log('Did you forget to add your DB_PASSWORD to the .env file?');
    }
  }
}

setupDatabase();
