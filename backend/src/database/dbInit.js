const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    password: 'INSIRA_A_SENHA_DO_POSTGRES_AQUI',
    port: 5432,
};

const dbName = 'saldosmart';

async function initDB() {
    const clientDefault = new Client({ ...dbConfig, database: 'postgres' });
    
    try {
        await clientDefault.connect();
        console.log('🔄 Verificando se o banco de dados existe...');
        
        const res = await clientDefault.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`);
        
        if (res.rowCount === 0) {
            console.log(`Criando banco de dados "${dbName}"...`);
            await clientDefault.query(`CREATE DATABASE ${dbName}`);
            console.log('Banco de dados criado com sucesso!');
        } else {
            console.log(`Banco de dados "${dbName}" já existe.`);
        }
    } catch (err) {
        console.error('Erro ao checar/criar o banco de dados:', err);
        process.exit(1);
    } finally {
        await clientDefault.end();
    }

    const clientProject = new Client({ ...dbConfig, database: dbName });
    
    try {
        await clientProject.connect();
        console.log('Lendo arquivo init.sql...');
        
        const sqlPath = path.join(__dirname, 'init.sql');
        const sqlFile = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Executando migrações (tabelas e inserts)...');
        await clientProject.query(sqlFile);
        
        console.log('Migrações concluídas com sucesso! O ambiente está pronto.');
    } catch (err) {
        console.error('Erro ao executar o arquivo SQL:', err);
    } finally {
        await clientProject.end();
    }
}

initDB();