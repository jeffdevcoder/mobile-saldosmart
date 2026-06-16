const bcrypt = require('bcrypt');
const pool = require('../config/db');

const userController = {
    async criar(req, res) {
        const { nome, email, senha } = req.body;

        try {
            const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userExists.rows.length > 0) {
                return res.status(400).json({ erro: 'Email já cadastrado.' });
            }

            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            const novoUsuario = await pool.query(
                'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, created_at',
                [nome, email, senhaHash]
            );

            return res.status(201).json(novoUsuario.rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },

    async editar(req, res) {
        const { id } = req.params;
        const { nome, email } = req.body;

        try {
            if (parseInt(id) !== req.userId) {
                return res.status(403).json({ erro: 'Acesso negado.' });
            }

            const userUpdated = await pool.query(
                'UPDATE users SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email',
                [nome, email, id]
            );

            if (userUpdated.rows.length === 0) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }

            return res.json(userUpdated.rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
        }
    },

    async excluir(req, res) {
        const { id } = req.params;

        try {
            if (parseInt(id) !== req.userId) {
                return res.status(403).json({ erro: 'Acesso negado.' });
            }

            await pool.query('BEGIN');
            
            await pool.query('DELETE FROM transactions WHERE user_id = $1', [id]);
            const userDeleted = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
            
            await pool.query('COMMIT');

            if (userDeleted.rows.length === 0) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }

            return res.status(204).send();
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao excluir usuário.' });
        }
    }
};

module.exports = userController;