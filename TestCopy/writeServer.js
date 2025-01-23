const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors')
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Path to your JSON file
const jsonFilePath = './attendance.json';

// Endpoint to handle POST requests for updating the JSON file
app.post('/update-date', (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    // Read the existing JSON file
    fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }

        let jsonData = JSON.parse(data);

        // Ensure dates array exists in the JSON
        if (!jsonData.dates) {
            jsonData.dates = [];
        }

        // Add the date to the JSON object
        jsonData.dates.push(date);

        // Write the updated data back to the JSON file
        fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing file' });
            }

            res.status(200).json({ message: 'Date added successfully', data: jsonData });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
