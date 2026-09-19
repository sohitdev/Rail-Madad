const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.get('/complaints', authenticateAdmin, adminController.getComplaints);
router.get('/summary', authenticateAdmin, adminController.getSummary);
router.put('/complaint/:id', authenticateAdmin, adminController.updateComplaint);
router.get('/departments', adminController.getDepartments);

module.exports = router;
