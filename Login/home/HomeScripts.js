// Fetch the JSON data and populate the table
fetch('http://localhost:3000/home')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('classTable');
        // Loop through the data and create rows with only the 'name' field
        data.forEach(item => {
            const row = document.createElement('tr'); // Create a new table row
            const cell = document.createElement('td'); // Create a single cell
            const link = document.createElement('a'); // Create an anchor tag

            link.href = `file:///C:/Users/anant/OneDrive/Documents/Anant/Comp%20Sci%20BA/Semester%203/Programming2/TheProject/StudentAttendance/Calender/Calender.html?class=${encodeURIComponent(item.name)}`; // Generate the link dynamically
            link.textContent = item.name; // Set the text content of the link to the class name

            cell.appendChild(link); // Append the link to the cell
            row.appendChild(cell); // Append the cell to the row
            tableBody.appendChild(row); // Append the row to the table body
        });
    })
    .catch(error => console.error('Error fetching data:', error));