# School Management API

This is a Node.js and Express backend API designed for managing school data. It connects to a MySQL database and provides endpoints to add new schools and fetch a list of schools sorted by geographical proximity to a user's location.

## Features
- **Add a School**: Accepts school details (name, address, latitude, longitude), validates the input, and stores it in the database.
- **Find Closest Schools**: Takes a user's latitude and longitude and returns a list of all schools, sorted by distance (closest first) using the Haversine formula.

## Tech Stack
- **Node.js** & **Express.js** (API Framework)
- **MySQL** (Database via `mysql2`)
- **Zod** (Input validation)
- **Vercel** (Serverless Deployment)

## API Endpoints

### 1. Add School
- **Endpoint:** `/api/addSchool`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi",
    "latitude": 28.5872,
    "longitude": 77.2415
  }
  ```

### 2. List Schools (Sorted by Proximity)
- **Endpoint:** `/api/listSchools`
- **Method:** `GET`
- **Query Parameters:** `latitude` and `longitude`
- **Example Request:** `/api/listSchools?latitude=28.7041&longitude=77.1025`

## Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your MySQL database credentials:
   ```env
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_PORT=your_db_port
   ```

3. **Database Setup**
   Run the provided `setup-db.js` script to automatically create the required database tables:
   ```bash
   node setup-db.js
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

## Testing
A `Postman_Collection.json` file is included in this repository. You can import this file directly into Postman to quickly test the live API endpoints.
