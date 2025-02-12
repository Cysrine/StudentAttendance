const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); 
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
let filePath = '';
app.use(express.static(path.join(__dirname, 'public')));


// function initalize()
// {
//     const data = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
//     let list = JSON.parse(fs.readFileSync('./students.json','utf-8'));
//     for(user of data)
//     {       
//         if( user.userId != "admin") {
//             filePath = './users/'+user.userId+'/classes.json';
//             let classList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//             for(student of classList)
//             {
//                 for(nameId of student.students)
//                 {   
//                     const check = list.find(student => student.id === nameId.id);
//                     if(!check)
//                     {
//                         const update = {"id": nameId.id, "name": nameId.name};
//                         console.log("update =", update);
//                         list.push(update);
//                     }
//                 }
//             }
//         }
//     }
//     fs.writeFile('students.json', JSON.stringify(list, null, 2), 'utf-8', (err) => {
//         if (err) {
//             console.log("Error writing student list:", err);
//             return console.log('Error writing student list');
//         }
//         console.log('Student list updated');
//     });
// }

app.post('/login', (req, res) => {
    const { username, password } = req.body;
 const pathj = path.join(__dirname, './users.json')
    fs.readFile(pathj, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading users.json:", err);
            return res.status(500).send({ message: 'Error reading file' });
        }

        const users = JSON.parse(data);
        console.log("users = ", users);

        // Find the user in the JSON database
        const userData = users.find(user => user.username === username && user.password === password);
        
        if (userData) {
            return res.status(200).json({ user: userData.userId });
        } else {
            return res.status(401).send({ message: 'Invalid username or password' });
        }
    });
});


app.post('/home', (req, res) => {
    const {user} = req.body;
        filePath = './users/'+user+'/classes.json';    
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) return res.status(500).send({ message: 'Error reading file' });
            const classes = JSON.parse(data);
            res.status(200).json(classes);
        });
    });

app.post('/update-class', (req, res) => {
    const updatedClass = req.body;

    try {
        // Read existing classes
        const classes = JSON.parse(fs.readFileSync('./classes.json', 'utf-8'));

        // Update the class by matching the ID
        const updatedClasses = classes.map(cls => 
            cls.id === updatedClass.id ? updatedClass : cls
        );

        // Write the updated data back to the file
        fs.writeFileSync('./classes.json', JSON.stringify(updatedClasses, null, 2));

        res.status(200).send({ message: 'Class updated successfully!' });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).send({ message: 'Failed to update class' });
    }
});


app.get('/load_students', (req, res) => {
    try {
        const students = JSON.parse(fs.readFileSync('./students.json', 'utf-8'));
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).send({ message: 'Error reading students.json file' });
    }
});

app.get('/load_icons', (req, res) => {
    try {
        const icons = JSON.parse(fs.readFileSync('./icon_names.json', 'utf-8'));
        res.status(200).json(icons);
    }
    catch (error) {
        res.status(500).send({ message: 'Error reading icon_names.json file' });
    }
});

app.post('/empty', (req, res) => {
    const { className, studentName, month } = req.body;
        let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const course = data.find(course => course.name === className);
        const student = course.students.find(student => student.name === studentName);
        for(let i = 0; i < student.attendance.length; i++)
        {
            let dateCheck = student.attendance[i];
            if(month === new Date(dateCheck.date).getMonth())
            {
                student.attendance.splice(i,1);
            }
        }
        
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
    
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return res.status(500).send({ error: 'Error reading file' });
        }
        
        let jsonData = JSON.parse(data);
        const course = jsonData.find(course => course.name === className);
        if (!course) {
            return res.status(404).send({ error: 'Class not found' });
        }
        const studentData = course.students.find(student => student.name === studentName);
        if (!studentData) {
            return res.status(404).send({ error: 'Student not found' });
        }
        if (!Array.isArray(studentData.attendance)) {
            studentData.attendance = [];
        }
        console.log("Emptied");
        studentData.attendance.push(attendance);
        console.log("pushed = ", attendance);
        console.log("JsonData = ", jsonData);
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send({ error: 'Error writing file' });
            }
            console.log("Updated", jsonData);
            res.status(200).json({ message: 'Attendance updated successfully', data: jsonData });
        });
    });
});

app.post('/create_class', (req, res) => {
    const { name, icon, students } = req.body;
    console.log("Data Received:", icon, name, students);

    // Read the existing JSON file
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error reading file:", err);
            return res.status(500).send({ error: 'Error reading file' });
        }

        let jsonData = JSON.parse(data);
        console.log("JSON Data:", jsonData);

        // Find the class
        console.log("Finding class name");
        const course = jsonData.find(course => course.name === name);
        if (course) {
            console.log("Class already exists")
            return res.status(500).send({ error: 'Class already exists' });
        }

        // Add the class
        jsonData.push({ name: name, icon: icon, students: students });
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
})

// Start the server
//app.listen('3000');
// initalize();
module.exports = app;
