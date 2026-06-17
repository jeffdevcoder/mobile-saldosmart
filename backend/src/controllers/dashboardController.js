const pool = require('../config/db');

const dashboardController = {
    async index(req, res) {
        try {
            const resumo = await pool.query(
                `
                SELECT
                    COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS entradas,
                    COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS saidas,
                    COUNT(*) AS total_transacoes
                FROM transactions
                WHERE user_id = $1
                `,
                [req.userId]
            );

            const movimentacoes = await pool.query(
                `
                SELECT
                    id,
                    tipo,
                    valor,
                    descricao,
                    created_at
                FROM transactions
                WHERE user_id = $1
                ORDER BY created_at DESC
                LIMIT 5
                `,
                [req.userId]
            );

            const dados = resumo.rows[0];

            const entradas = Number(dados.entradas);
            const saidas = Number(dados.saidas);

            return res.json({
                saldo: entradas - saidas,
                entradas,
                saidas,
                totalTransacoes: Number(dados.total_transacoes),
                ultimasMovimentacoes: movimentacoes.rows
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                erro: 'Erro ao carregar dashboard.'
            });
        }
    }
};

module.exports = dashboardController;