const db = require('../config/db');
const { z } = require('zod');
const { calculateDistance } = require('../utils/haversine');

// Validation schema for adding a school
const addSchoolSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude')
});

// Validation schema for listing schools
const listSchoolsSchema = z.object({
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Invalid latitude'),
  longitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Invalid longitude')
});

/**
 * Add a new school
 */
exports.addSchool = async (req, res) => {
  try {
    // 1. Validate input data
    const validatedData = addSchoolSchema.parse(req.body);
    const { name, address, latitude, longitude } = validatedData;

    // 2. Insert into database
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, address, latitude, longitude]);

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({ field: err.path[0], message: err.message }))
      });
    }

    console.error('Error adding school:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * List schools sorted by proximity
 */
exports.listSchools = async (req, res) => {
  try {
    // 1. Validate query parameters
    const validatedQuery = listSchoolsSchema.parse(req.query);
    const userLat = parseFloat(validatedQuery.latitude);
    const userLon = parseFloat(validatedQuery.longitude);

    // 2. Fetch all schools from the database
    const [schools] = await db.execute('SELECT * FROM schools');

    // 3. Calculate distance for each school and sort
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return {
        ...school,
        distanceInKm: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
      };
    });

    // Sort by distance (closest first)
    schoolsWithDistance.sort((a, b) => a.distanceInKm - b.distanceInKm);

    return res.status(200).json({
      success: true,
      count: schoolsWithDistance.length,
      data: schoolsWithDistance
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: latitude and longitude are required and must be valid numbers',
        errors: error.errors.map(err => ({ field: err.path[0], message: err.message }))
      });
    }

    console.error('Error fetching schools:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
