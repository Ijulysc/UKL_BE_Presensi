const express = require('express');
const router = express.Router();
const absenController = require('../controllers/absen.controller');

// Routes untuk absen
router.get('/history/:id', absenController.getAbsenHistory);  // Menambahkan endpoint history
router.get('/', absenController.getAllAbsen);            // Get all attendance records
router.post('/', absenController.addAbsen);             // Add new attendance record
router.post('/filter', absenController.findAbsen);      // Filter attendance records
router.put('/:id', absenController.updateAbsen);        // Update attendance record
router.delete('/:id', absenController.deleteAbsen);     // Delete attendance record
router.get('/summary', absenController.getSummary);      // Mengganti summaryAbsen dengan getSummary

// Corrected route for analysis (make sure it's consistent with the controller function)
router.post('/analysis', absenController.postAnalysis);  // Make sure the function name matches

module.exports = router;
