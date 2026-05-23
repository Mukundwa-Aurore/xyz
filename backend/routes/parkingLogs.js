const express = require('express');
const { body } = require('express-validator');
const {
  createParkingLog,
  exitParking,
  getParkingLogs,
  generateTicket,
  generateBill,
} = require('../controllers/parkingLogController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Entry/Exit Service
 *   description: Parking log management
 */

/**
 * @swagger
 * /parking-logs:
 *   post:
 *     summary: Register a new car entry
 *     tags: [Entry/Exit Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - parkingCode
 *             properties:
 *               plateNumber:
 *                 type: string
 *               parkingCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parking log created
 *       400:
 *         description: No available spaces
 */
router.post(
  '/',
  protect,
  authorize('admin', 'attendant'),
  [
    body('plateNumber').not().isEmpty().withMessage('Plate number is required'),
    body('parkingCode').not().isEmpty().withMessage('Parking code is required'),
  ],
  createParkingLog
);

/**
 * @swagger
 * /parking-logs/{id}/exit:
 *   put:
 *     summary: Process car exit
 *     tags: [Entry/Exit Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car exit processed
 *       404:
 *         description: Parking log not found
 */
router.put('/:id/exit', protect, authorize('admin', 'attendant'), exitParking);

/**
 * @swagger
 * /parking-logs:
 *   get:
 *     summary: Get all parking logs (paginated)
 *     tags: [Entry/Exit Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of parking logs
 */
router.get('/', protect, getParkingLogs);

/**
 * @swagger
 * /parking-logs/{id}/ticket:
 *   get:
 *     summary: Download entry ticket PDF (Billing & Ticket Service)
 *     tags: [Entry/Exit Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF ticket
 *       404:
 *         description: Parking log not found
 */
router.get('/:id/ticket', protect, generateTicket);

/**
 * @swagger
 * /parking-logs/{id}/bill:
 *   get:
 *     summary: Download exit bill PDF (Billing & Ticket Service)
 *     tags: [Entry/Exit Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF bill
 *       400:
 *         description: Car has not exited yet
 */
router.get('/:id/bill', protect, generateBill);

module.exports = router;
