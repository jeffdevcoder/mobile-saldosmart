const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/users', userController.criar);

// AUTENTICAÇÃO COM JWT
router.get('/users', authMiddleware, userController.listar);
router.put('/users/:id', authMiddleware, userController.editar);
router.delete('/users/:id', authMiddleware, userController.excluir);

module.exports = router;