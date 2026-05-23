const express = require('express');
const { body } = require('express-validator');
const {
  createCarEntry,
  exitCar,
  getCarEntries,
  generateTicket,
  generateBill,
} = require('../controllers/carEntryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Car Entries
 *   description: Car entry and exit management
 */

/**
 * @swagger
 * /car-entries:
 *   post:
 *     summary: Register a new car entry
 *     tags: [Car Entries]
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
 *         description: Car entry created
 *       400:
 *         description: No available spaces
 */
router.post(
  '/',
  protect,
  authorize('admin', 'parking_attendant'),
  [
    body('plateNumber').not().isEmpty().withMessage('Plate number is required'),
    body('parkingCode').not().isEmpty().withMessage('Parking code is required'),
  ],
  createCarEntry
);

/**
 * @swagger
 * /car-entries/{id}/exit:
 *   put:
 *     summary: Process car exit
 *     tags: [Car Entries]
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
 *         description: Car entry not found
 */
router.put('/:id/exit', protect, authorize('admin', 'parking_attendant'), exitCar);

/**
 * @swagger
 * /car-entries:
 *   get:
 *     summary: Get all car entries (paginated)
 *     tags: [Car Entries]
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
 *         description: List of car entries
 */
router.get('/', protect, getCarEntries);

/**
 * @swagger
 * /car-entries/{id}/ticket:
 *   get:
 *     summary: Download entry ticket PDF
 *     tags: [Car Entries]
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
 *         description: Car entry not found
 */
router.get('/:id/ticket', protect, generateTicket);

/**
 * @swagger
 * /car-entries/{id}/bill:
 *   get:
 *     summary: Download exit bill PDF
 *     tags: [Car Entries]
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
