function renderStudentList(className, filter = "") {
    studentListElement.innerHTML = "";

    // Find the class by its name
    const selectedClass = classes.find(cls => cls.name === className);

    // If the class is not found, exit early
    if (!selectedClass) {
        console.error(`Class "${className}" not found.`);
        return;
    }

    // Access the students of the selected class
    const filteredStudents = selectedClass.students.filter(student =>
        student.name.toLowerCase().includes(filter.toLowerCase())
    );

    // Render the filtered students
    filteredStudents.forEach(student => {
        const studentDiv = document.createElement('div');
        studentDiv.classList.add('student');

        const studentName = document.createElement('span');
        studentName.textContent = student.name;

        const addButton = document.createElement('button');
        addButton.textContent = "Add";
        addButton.onclick = () => addStudentToClass(student);

        studentDiv.appendChild(studentName);
        studentDiv.appendChild(addButton);
        studentListElement.appendChild(studentDiv);
    });
}
