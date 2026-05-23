const db = require('../models');
const { Op } = require('sequelize');

const getOutgoingCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {
      status: 'exited',
    };

    if (startDate && endDate) {
      whereClause.exitDateTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows } = await db.ParkingLog.findAndCountAll({
      where: whereClause,
      include: [
        { model: db.ParkingLocation },
        { model: db.User, attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
      limit,
      offset,
      order: [['exitDateTime', 'DESC']],
    });

    // Calculate total amount for ALL records matching the search criteria, not just the paginated subset
    const totalAmount = await db.ParkingLog.sum('chargedAmount', { where: whereClause }) || 0;

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalAmount,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEnteredCars = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (startDate && endDate) {
      whereClause.entryDateTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows } = await db.ParkingLog.findAndCountAll({
      where: whereClause,
      include: [
        { model: db.ParkingLocation },
        { model: db.User, attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
      limit,
      offset,
      order: [['entryDateTime', 'DESC']],
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

module.exports = { getOutgoingCars, getEnteredCars };
