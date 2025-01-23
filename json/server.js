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

app.post('/update', (req, res) => {
    const { className, student, attendance } = req.body;

    // Read the existing JSON file
    fs.readFile('classes.json', 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }

        let jsonData = JSON.parse(data);

        // Find the class
        const course = jsonData.find(c => c.className === className);
        if (!course) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Find the student
        const studentData = course.students.find(s => s.name === student);
        if (!studentData) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Add the attendance record
        if (!Array.isArray(studentData.attendance)) {
            studentData.attendance = [];
        }
        studentData.attendance.push(attendance);

        // Write the updated data back to the JSON file
        fs.writeFile('classes.json', JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error writing file' });
            }

            res.status(200).json({ message: 'Attendance updated successfully', data: jsonData });
        });
    });
});

// Start the server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
