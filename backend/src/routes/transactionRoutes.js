const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/transactions', authMiddleware, transactionController.create);
router.get('/transactions', authMiddleware, transactionController.list);
router.delete('/transactions/:id', authMiddleware, transactionController.delete);

module.exports = router;