const pool = require('../config/db');

const transactionController = {
    async create(req, res) {
        const { tipo, valor, descricao } = req.body;

        try {
            const result = await pool.query(
                `INSERT INTO transactions
                (user_id, tipo, valor, descricao)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [req.userId, tipo, valor, descricao]
            );

            return res.status(201).json(result.rows[0]);

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: 'Erro ao criar transação.'
            });
        }
    },

    async list(req, res) {
        try {
            const result = await pool.query(
                `SELECT *
                 FROM transactions
                 WHERE user_id = $1
                 ORDER BY created_at DESC`,
                [req.userId]
            );

            return res.json(result.rows);

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: 'Erro ao listar transações.'
            });
        }
    },

    async delete(req, res) {
        const { id } = req.params;

        try {
            const result = await pool.query(
                `DELETE FROM transactions
                 WHERE id = $1
                 AND user_id = $2
                 RETURNING *`,
                [id, req.userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    erro: 'Transação não encontrada.'
                });
            }

            return res.status(204).send();

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: 'Erro ao excluir transação.'
            });
        }
    }
};

module.exports = transactionController;