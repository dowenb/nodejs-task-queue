require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http');

// Inits
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static('public'))

// Create and start the server
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Web started on: ${PORT}`);
});