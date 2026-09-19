const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const complaintController = require('../controllers/complaintController');

router.post('/request-otp', complaintController.requestOtp);
router.post('/submit-complaint', upload.single('file'), complaintController.submitComplaint);
router.get('/track-complaint', complaintController.trackComplaint);
router.post('/submit-feedback', complaintController.submitFeedback);

module.exports = router;
