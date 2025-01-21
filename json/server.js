const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); // Import CORS

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins

// Load users from the JSON file
const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find the user in the JSON database
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.status(200).send({ message: 'Login successful' });
    } else {
        res.status(401).send({ message: 'Invalid username or password' });
    }
}); 

app.get('/home', (req, res) => {
    try {
        const classes = JSON.parse(fs.readFileSync('classes.json', 'utf-8'));
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).send({ message: 'Error reading classes.json file' });
    }
}); 

// Start the server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
