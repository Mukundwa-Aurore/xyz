const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const db = require('../models');

const createCarEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plateNumber, parkingCode } = req.body;

    const parking = await db.Parking.findByPk(parkingCode);
    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    if (parking.availableSpaces <= 0) {
      return res.status(400).json({ message: 'No available spaces' });
    }

    const carEntry = await db.CarEntry.create({
      plateNumber,
      parkingCode,
      attendantId: req.user.id,
    });

    await parking.decrement('availableSpaces');

    res.status(201).json({ success: true, data: carEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const exitCar = async (req, res) => {
  try {
    const carEntry = await db.CarEntry.findByPk(req.params.id);
    if (!carEntry) {
      return res.status(404).json({ message: 'Car entry not found' });
    }

    if (carEntry.exitDateTime) {
      return res.status(400).json({ message: 'Car already exited' });
    }

    const parking = await db.Parking.findByPk(carEntry.parkingCode);
    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    const exitDateTime = new Date();
    const entryDateTime = new Date(carEntry.entryDateTime);
    const durationMs = exitDateTime - entryDateTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const chargedAmount = durationHours * parseFloat(parking.chargingFeePerHour);

    await carEntry.update({
      exitDateTime,
      chargedAmount,
    });

    await parking.increment('availableSpaces');

    res.json({
      success: true,
      data: {
        ...carEntry.toJSON(),
        durationHours,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCarEntries = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.CarEntry.findAndCountAll({
      include: [
        { model: db.Parking },
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

const generateTicket = async (req, res) => {
  try {
    const carEntry = await db.CarEntry.findByPk(req.params.id, {
      include: [db.Parking],
    });

    if (!carEntry) {
      return res.status(404).json({ message: 'Car entry not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${carEntry.id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('XWZ Parking - Entry Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Plate Number: ${carEntry.plateNumber}`);
    doc.text(`Parking: ${carEntry.Parking.parkingName} (${carEntry.Parking.code})`);
    doc.text(`Location: ${carEntry.Parking.location}`);
    doc.text(`Entry Time: ${carEntry.entryDateTime}`);
    doc.text(`Fee per Hour: ${carEntry.Parking.chargingFeePerHour} RWF`);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateBill = async (req, res) => {
  try {
    const carEntry = await db.CarEntry.findByPk(req.params.id, {
      include: [db.Parking],
    });

    if (!carEntry) {
      return res.status(404).json({ message: 'Car entry not found' });
    }

    if (!carEntry.exitDateTime) {
      return res.status(400).json({ message: 'Car has not exited yet' });
    }

    const entryDateTime = new Date(carEntry.entryDateTime);
    const exitDateTime = new Date(carEntry.exitDateTime);
    const durationMs = exitDateTime - entryDateTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bill-${carEntry.id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('XWZ Parking - Exit Bill', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Plate Number: ${carEntry.plateNumber}`);
    doc.text(`Parking: ${carEntry.Parking.parkingName} (${carEntry.Parking.code})`);
    doc.text(`Location: ${carEntry.Parking.location}`);
    doc.text(`Entry Time: ${carEntry.entryDateTime}`);
    doc.text(`Exit Time: ${carEntry.exitDateTime}`);
    doc.text(`Duration: ${durationHours} hour(s)`);
    doc.text(`Fee per Hour: ${carEntry.Parking.chargingFeePerHour} RWF`);
    doc.fontSize(18).text(`Total Amount: ${carEntry.chargedAmount} RWF`, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createCarEntry, exitCar, getCarEntries, generateTicket, generateBill };
