const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const db = require('../models');

const createParkingLog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plateNumber, parkingCode } = req.body;

    const parking = await db.ParkingLocation.findByPk(parkingCode);
    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    if (parking.availableSpaces <= 0) {
      return res.status(400).json({ message: 'No available spaces' });
    }

    const parkingLog = await db.ParkingLog.create({
      plateNumber,
      parkingCode,
      attendantId: req.user.id,
      status: 'parked',
    });

    await parking.decrement('availableSpaces');

    res.status(201).json({ success: true, data: parkingLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const exitParking = async (req, res) => {
  try {
    const parkingLog = await db.ParkingLog.findByPk(req.params.id);
    if (!parkingLog) {
      return res.status(404).json({ message: 'Parking log not found' });
    }

    if (parkingLog.status === 'exited') {
      return res.status(400).json({ message: 'Car already exited' });
    }

    const parking = await db.ParkingLocation.findByPk(parkingLog.parkingCode);
    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    const exitDateTime = new Date();
    const entryDateTime = new Date(parkingLog.entryDateTime);
    const durationMs = exitDateTime - entryDateTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const chargedAmount = durationHours * parseFloat(parking.hourlyFee);

    await parkingLog.update({
      exitDateTime,
      chargedAmount,
      status: 'exited',
    });

    await parking.increment('availableSpaces');

    res.json({
      success: true,
      data: {
        ...parkingLog.toJSON(),
        durationHours,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getParkingLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.ParkingLog.findAndCountAll({
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

const generateTicket = async (req, res) => {
  try {
    const parkingLog = await db.ParkingLog.findByPk(req.params.id, {
      include: [db.ParkingLocation],
    });

    if (!parkingLog) {
      return res.status(404).json({ message: 'Parking log not found' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${parkingLog.id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('XWZ Parking - Entry Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Plate Number: ${parkingLog.plateNumber}`);
    doc.text(`Parking: ${parkingLog.ParkingLocation.name} (${parkingLog.ParkingLocation.code})`);
    doc.text(`Location: ${parkingLog.ParkingLocation.location}`);
    doc.text(`Entry Time: ${parkingLog.entryDateTime}`);
    doc.text(`Fee per Hour: ${parkingLog.ParkingLocation.hourlyFee} RWF`);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateBill = async (req, res) => {
  try {
    const parkingLog = await db.ParkingLog.findByPk(req.params.id, {
      include: [db.ParkingLocation],
    });

    if (!parkingLog) {
      return res.status(404).json({ message: 'Parking log not found' });
    }

    if (parkingLog.status !== 'exited') {
      return res.status(400).json({ message: 'Car has not exited yet' });
    }

    const entryDateTime = new Date(parkingLog.entryDateTime);
    const exitDateTime = new Date(parkingLog.exitDateTime);
    const durationMs = exitDateTime - entryDateTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=bill-${parkingLog.id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('XWZ Parking - Exit Bill', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Plate Number: ${parkingLog.plateNumber}`);
    doc.text(`Parking: ${parkingLog.ParkingLocation.name} (${parkingLog.ParkingLocation.code})`);
    doc.text(`Location: ${parkingLog.ParkingLocation.location}`);
    doc.text(`Entry Time: ${parkingLog.entryDateTime}`);
    doc.text(`Exit Time: ${parkingLog.exitDateTime}`);
    doc.text(`Duration: ${durationHours} hour(s)`);
    doc.text(`Fee per Hour: ${parkingLog.ParkingLocation.hourlyFee} RWF`);
    doc.fontSize(18).text(`Total Amount: ${parkingLog.chargedAmount} RWF`, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createParkingLog, exitParking, getParkingLogs, generateTicket, generateBill };
