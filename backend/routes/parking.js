const express = require('express');
const { body } = require('express-validator');
const { createParking, getParkings, getParkingByCode } = require('../controllers/parkingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Parking Service
 *   description: Parking location management
 */

/**
 * @swagger
 * /parking:
 *   post:
 *     summary: Create a new parking location (Admin only)
 *     tags: [Parking Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - totalSpaces
 *               - location
 *               - hourlyFee
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               totalSpaces:
 *                 type: integer
 *               location:
 *                 type: string
 *               hourlyFee:
 *                 type: number
 *     responses:
 *       201:
 *         description: Parking location created
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('code').not().isEmpty().withMessage('Code is required'),
    body('name').not().isEmpty().withMessage('Name is required'),
    body('totalSpaces').isInt({ min: 1 }).withMessage('Total spaces must be at least 1'),
    body('location').not().isEmpty().withMessage('Location is required'),
    body('hourlyFee').isFloat({ min: 0 }).withMessage('Hourly fee must be a positive number'),
  ],
  createParking
);

/**
 * @swagger
 * /parking:
 *   get:
 *     summary: Get all parking locations (paginated)
 *     tags: [Parking Service]
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
 *         description: List of parking locations
 */
router.get('/', protect, getParkings);

/**
 * @swagger
 * /parking/{code}:
 *   get:
 *     summary: Get a parking location by code
 *     tags: [Parking Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parking location data
 *       404:
 *         description: Parking not found
 */
router.get('/:code', protect, getParkingByCode);

module.exports = router;
