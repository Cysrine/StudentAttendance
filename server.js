const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); 
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
let filePath = '';
let pathStatic = '';
app.use(express.static(path.join(__dirname, 'public')));

// function initalize()
// {
//     const data = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
//     let list = JSON.parse(fs.readFileSync('students.json','utf-8'));
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
    pathStatic = path.join(__dirname, './json/users.json')
    fs.readFile(pathStatic, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading users.json:", err);
            return res.status(500).send({ message: 'Error reading file' });
        }
        const users = JSON.parse(data);

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
    filePath = path.join(__dirname, `./users/${user}/classes.json`);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            console.error(`Error reading classes of user ${user}`, err);
            return res.status(500).send({ message: 'Error reading file' });
        }
        const classes = JSON.parse(data);
        return res.status(200).json(classes);
    })
});

app.post('/update-class', (req, res) => {
    const { updatedClass, user } = req.body;
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            console.error(`Error reading classes of user ${user}`, err);
            return res.status(500).send({message: 'Error reading file'});
        }
        const classes = JSON.parse(data);
        // Find the class to update by matching the ID
        const classIndex = classes.findIndex(cls => cls.id === updatedClass.id);
        if (classIndex === -1) {
            return res.status(404).send({ message: 'Class not found' });
        }
        // Update only the students inside the found class
        classes[classIndex].students = updatedClass.students;
        // Write the updated data back to the file
        fs.writeFile(filePath, JSON.stringify(classes, null, 2));
        res.status(200).json({ message: 'Class updated successfully!' });
    }); 
});



app.get('/load_students', (req, res) => {
    pathStatic = path.join(__dirname, './json/students.json');
    fs.readFile(pathStatic, 'utf-8', (err, data) => {
        if(err) {
            console.error("Error reading student list");
            return res.status(500).send({message: 'Error reading file'});
        }
        const students = JSON.parse(data);
        return res.status(200).json(students); 
    })
});

app.get('/load_icons', (req, res) => {
    pathStatic = path.join(__dirname, './json/icon_names.json');
    fs.readFile(pathStatic, 'utf-8', (err, data) => {
        if(err) {
            console.error(`Error reading icons list`, err);
            return res.status(500).send({message: "Error reading file"});
        }
        const icons = JSON.parse(data);
        return res.status(200).json(icons);
    })
});

app.post('/empty', (req, res) => {
    const { className, studentName, month } = req.body;
        fs.readFile(filePath, 'utf-8', (err, data) => {
            let classes = JSON.parse(data);
            const course = classes.find(course => course.name === className);
            const student = course.students.find(student => student.name === studentName);
            for(let i = 0; i < student.attendance.length; i++)
            {
                let dateCheck = student.attendance[i];
                if(month === new Date(dateCheck.date).getMonth())
                {
                    student.attendance.splice(i,1);
                }
            }
            fs.writeFile(filePath, JSON.stringify(classes, null, 2), 'utf-8', (err) => {
                if (err) {
                    console.log("Error writing file:", err);
                    return res.status(500).send({ error: 'Error writing file' });
                }
                return res.status(200).json({ message: 'Attendance deleted successfully', data: data });
            });
        });
    });

app.post('/update', (req, res) => {
    const { className, studentName, attendance } = req.body;
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error reading classes", err);
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
        studentData.attendance.push(attendance);
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send({ error: 'Error writing file' });
            }
            console.log("Updated");
            return res.status(200).json({ message: 'Attendance updated successfully', data: jsonData });
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
            return res.status(200).json({ message: 'Class created successfully', data: jsonData });
        });
    });
});

app.post('/delete_class', (req, res) => {
    const { name } = req.body;
    console.log("Data Received:", name);
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
        if (!course) {
            console.log("Class doesn't exist")
            return res.status(500).send({ error: "Class doesn't exist" });
        }
        // Delete the class
        const index = jsonData.indexOf(course);
        jsonData.splice(index, 1);
        console.log("Class deleted");
        // Write the updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8', (err) => {
            if (err) {
                console.log("Error writing file:", err);
                return res.status(500).send({ error: 'Error writing file' });
            }
            return res.status(200).json({ message: 'Class deleted successfully', data: jsonData });
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
        return res.json(userList);
    });
})

// Start the server
module.exports = app;
//app.listen(3000, () => console.log('Server running at http://localhost:3000'));
//initalize();

