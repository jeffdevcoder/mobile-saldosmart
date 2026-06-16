const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',           
    host: 'localhost',          
    database: 'saldosmart',     
    password: '1234',
    port: 5432,                
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao PostgreSQL:', err.stack);
    }
    console.log('Conectado ao banco de dados PostgreSQL com sucesso');
    release();
});

module.exports = pool;