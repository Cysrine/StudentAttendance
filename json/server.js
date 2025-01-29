const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); // Import CORS
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins
let filePath = '';
// Load users from the JSON file
// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
    // Find the user in the JSON database
    const data = users.find(user => user.username === username && user.password === password);
    if (data) {
        res.status(200).json({user: data.userId,});
    } 
    else {
        res.status(401).send({ message: 'Invalid username or password' });
    }
}); 

app.post('/home', (req, res) => {
    const {user} = req.body;
    try {
        filePath = './users/'+user+'/classes.json';
        console.log("FilePath = ", filePath);
        const classes = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        res.status(200).json(classes);
    } 
    catch (error) {
        res.status(500).send({ message: 'Error reading classes.json file' });
    }
}); 

app.post('/load_students', (req, res) => {
    try {
        filePath = './students.json';
        console.log("FilePath = ", filePath);
        const students = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).send({ message: 'Error reading students.json file' });
    }
});

app.post('/empty', (req, res) => {
    const { className, studentName, month } = req.body;
        console.log("Entered Empty with:", className);
        let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log("Searching for class name");
        const course = data.find(course => course.name === className);
        console.log("variable course: ", course.students);
        const student = course.students.find(student => student.name === studentName);
        console.log("variable student: ", student);
        console.log("Attendance before clearing:", student.attendance);
        for(let i = 0; i < student.attendance.length; i++)
        {
            let dateCheck = student.attendance[i];
            if(month === new Date(dateCheck.date).getMonth())
            {
                console.log("Month found, clearing attendance", dateCheck.date);
                student.attendance.splice(i,1);
            }
        }

        console.log("Attendance after clearing:", student.attendance);
        console.log("Attendance cleared, Writing to JSON file");
        
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send({ error: 'Error writing file' });
            }

            res.status(200).json({ message: 'Attendance deleted successfully', data: data });
        });
});

app.post('/update', (req, res) => {
    const { className, studentName, attendance } = req.body;
    console.log("Data Received:", className, studentName, attendance);

    // Read the existing JSON file
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return res.status(500).send({ error: 'Error reading file' });
        }

        let jsonData = JSON.parse(data);

        // Find the class
        console.log("Finding class name");
        const course = jsonData.find(course => course.name === className);
        if (!course) {
            console.log("Class not found")
            return res.status(404).send({ error: 'Class not found' });
        }

        // Find the student
        console.log("Finding student name");
        const studentData = course.students.find(student => student.name === studentName);
        if (!studentData) {
            console.log("Student not found")
            return res.status(404).send({ error: 'Student not found' });
        }

        // Add the attendance record
        if (!Array.isArray(studentData.attendance)) {
            studentData.attendance = [];
            console.log("Attendance added to array")
        }
        studentData.attendance.push(attendance);
        console.log("Attendance pushed");

        // Write the updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send({ error: 'Error writing file' });
            }

            res.status(200).json({ message: 'Attendance updated successfully', data: jsonData });
        });
    });
});

app.post('/create_class', (req, res) => {
    const { classID, className, students } = req.body;
    console.log("Data Received:", classID, className, students);

    // Read the existing JSON file
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return res.status(500).send({ error: 'Error reading file' });
        }

        let jsonData = JSON.parse(data);

        // Find the class
        console.log("Finding class id");
        const course = jsonData.find(course => course.id === classID);
        if (course) {
            console.log("Class already exists")
            return res.status(404).send({ error: 'Class already exists' });
        }

        // Add the class
        jsonData.push({ id: classID, name: className, students: students });
        console.log("Class pushed");

        // Write the updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send({ error: 'Error writing file' });
            }

            res.status(200).json({ message: 'Class created successfully', data: jsonData });
        });
    });
});

app.get('/userList', (req, res) => {
    fs.readFile('users.json', 'utf-8', (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return res.status(500).send({ error: 'Error reading file' });
        }

        const userList = JSON.parse(data);
        res.json(userList);
    });
});

// Start the server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
