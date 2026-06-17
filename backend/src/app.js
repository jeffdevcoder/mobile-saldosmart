const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes'); 
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'SaldoSmart API Online'
    });
});

app.use(authRoutes);
app.use(transactionRoutes);
app.use(dashboardRoutes);

module.exports = app;