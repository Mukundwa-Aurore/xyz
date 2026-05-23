const express = require('express');
const { getOutgoingCars, getEnteredCars } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reporting Service
 *   description: Parking reports and analytics
 */

/**
 * @swagger
 * /reports/outgoing:
 *   get:
 *     summary: Get outgoing cars report (Admin only)
 *     tags: [Reporting Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
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
 *         description: Outgoing cars report with revenue
 */
router.get('/outgoing', protect, authorize('admin'), getOutgoingCars);

/**
 * @swagger
 * /reports/entered:
 *   get:
 *     summary: Get entered cars report (Admin only)
 *     tags: [Reporting Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
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
 *         description: Entered cars report
 */
router.get('/entered', protect, authorize('admin'), getEnteredCars);

module.exports = router;
