const { validationResult } = require('express-validator');
const db = require('../models');

const createParking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, name, totalSpaces, location, hourlyFee } = req.body;

    const parking = await db.ParkingLocation.create({
      code,
      name,
      totalSpaces,
      availableSpaces: totalSpaces,
      location,
      hourlyFee,
    });

    res.status(201).json({ success: true, data: parking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getParkings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.ParkingLocation.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getParkingByCode = async (req, res) => {
  try {
    const parking = await db.ParkingLocation.findByPk(req.params.code);

    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    res.json({ success: true, data: parking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createParking, getParkings, getParkingByCode };
