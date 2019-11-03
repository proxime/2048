const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'main.html'));
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));