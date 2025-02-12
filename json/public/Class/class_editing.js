        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const PORT = process.env.PORT || 3000;
        
        // DOWNLOAD LIVE SERVER EXTENSION AND RUN ON IT

        let classes = [];
        let students = [];
        // fetch('../json/classes.json')
        //     .then(response => response.json())
        //     .then(data => {
        //         classes = data;
        //         const allStudents = classes.flatMap(classItem => classItem.students);
        //         students = Array.from(new Map(allStudents.map(s => [s.name, s])).values());
        //         renderClassList();
        //     })
        //     .catch(error => console.error('Error loading students:', error));


        fetch(`http://localhost:${PORT}/home`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: user })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            classes = data;
            renderClassList();
            console.log('Classes (let):', classes);
        });


        fetch(`http://localhost:${PORT}/load_students`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify()
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            students = data;
            renderStudentList();
            console.log('Students (let):', students);
        });



        const studentListElement = document.getElementById('student-list');
        const selectedStudentListElement = document.getElementById('selected-student-list');
        const searchInput = document.getElementById('student-search');
        const ClassListElement = document.getElementById('class-list');
        let selectedClass = null; // To store the currently selected class


        function renderClassList(filter = "") {
            ClassListElement.innerHTML = ""; // Clear the class list

            const filteredClasses = classes.filter(classItem =>
                classItem.name.toLowerCase().includes(filter.toLowerCase())
            );

            filteredClasses.forEach(classItem => {
                const classDiv = document.createElement('div');
                classDiv.classList.add('class');

                const className = document.createElement('span');
                className.textContent = classItem.name;

                const chooseButton = document.createElement('button');
                chooseButton.textContent = "Choose";
                chooseButton.onclick = () => {
                    selectedClass = classItem;
                    console.log("button choose pressed");
                    document.getElementById('class-title').textContent = `Add/Remove Students to ${selectedClass.name}:`;
                    renderStudentList();
            };

                classDiv.appendChild(className);
                classDiv.appendChild(chooseButton);
                ClassListElement.appendChild(classDiv);
            });
        }

        function renderStudentList(filter = "") {
            studentListElement.innerHTML = "";
            if (!selectedClass) {
                alert("Please select a class first!");
                return;
            }
            const filteredStudents = students.filter(student => 
                student.name.toLowerCase().includes(filter.toLowerCase())
            );
    
            filteredStudents.forEach(student => {
                const studentDiv = document.createElement('div');
                studentDiv.classList.add('student');
        
                const studentName = document.createElement('span');
                studentName.textContent = student.name;
        
                const addButton = document.createElement('button');
                const isStudentInClass = selectedClass.students.some(
                    classStudent => classStudent.name === student.name
                );
                if (isStudentInClass){
                    addButton.textContent = "Delete"
                }
                else{
                    addButton.textContent = "Add"
                }

                addButton.onclick = () => {
                    if (isStudentInClass) {
                        removeStudentFromClass(student);
                    } else {
                        addStudentToClass(student);
                    }
                    renderStudentList(filter); // Re-render to update the button text
                };

        
                studentDiv.appendChild(studentName);
                studentDiv.appendChild(addButton);
                studentListElement.appendChild(studentDiv);
            });
        }

        function addStudentToClass(student) {
            selectedClass.students.push(student);
            updateClassOnServer(selectedClass);
        }

        searchInput.addEventListener('input', (event) => {
            renderStudentList(event.target.value);
        });


        function removeStudentFromClass(student) {
            selectedClass.students = selectedClass.students.filter(
                classStudent => classStudent.name !== student.name
            );
            updateClassOnServer(selectedClass);
        }
        
        function updateClassOnServer(updatedClass) {
            fetch(`http://localhost:${PORT}/update-class`, {  // Ensure the correct server address
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedClass)
            })
            .then(response => response.json())
            .then(data => console.log(data.message))
            .catch(error => console.error('Error updating class:', error));
        }