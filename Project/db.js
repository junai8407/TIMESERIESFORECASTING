const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Open a SQLite database connection
let db = new sqlite3.Database('ARIMA.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to fetch data from the database for a specific model
app.get('/data', (req, res) => {
    const selectedModel = req.query.model;
    if (!selectedModel) {
        return res.status(400).send('Model parameter is required');
    }

    db.all(`SELECT * FROM ${selectedModel}`, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(rows);
    });
});

// Endpoint to fetch data from the Main table
app.get('/main', (req, res) => {
    db.all(`SELECT DATE, CLOSE FROM Main`, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(rows);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
