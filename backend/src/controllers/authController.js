const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authController = {
    async register(req, res) {
        const { nome, email, senha } = req.body;

        try {
            const userExists = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (userExists.rows.length > 0) {
                return res.status(400).json({
                    erro: 'Email já cadastrado.'
                });
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            const novoUsuario = await pool.query(
                `INSERT INTO users (nome, email, senha)
                 VALUES ($1, $2, $3)
                 RETURNING id, nome, email`,
                [nome, email, senhaHash]
            );

            return res.status(201).json(novoUsuario.rows[0]);

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: 'Erro interno no servidor.'
            });
        }
    },

    async login(req, res) {
        const { email, senha } = req.body;

        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    erro: 'Email ou senha inválidos.'
                });
            }

            const user = result.rows[0];

            const senhaValida = await bcrypt.compare(
                senha,
                user.senha
            );

            if (!senhaValida) {
                return res.status(401).json({
                    erro: 'Email ou senha inválidos.'
                });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.json({
                token,
                usuario: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: 'Erro interno no servidor.'
            });
        }
    }
};

module.exports = authController;