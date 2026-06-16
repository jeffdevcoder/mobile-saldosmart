const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'SaldoSmart API Online'
    });
});

app.use(userRoutes);

module.exports = app;