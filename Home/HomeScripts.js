const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
console.log("User Home = ",user);
const heading = document.getElementById("teacherName");
// Fetch the JSON data and populate the table
    fetch('http://localhost:3000/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        const tableBody = document.getElementById('classTable');
        // Loop through the data and create rows with only the 'name' field
        data.forEach(item => {
            const row = document.createElement('tr'); // Create a new table row
            const cell = document.createElement('td'); // Create a single cell
            const link = document.createElement('a'); // Create an anchor tag
            link.href = `../Calender/Calender.html?class=${encodeURIComponent(item.name)}&user=${encodeURIComponent(user)}`; // Generate the link dynamically
            link.textContent = item.name; // Set the text content of the link to the class name
            cell.appendChild(link); // Append the link to the cell
            row.appendChild(cell); // Append the cell to the row
            tableBody.appendChild(row); // Append the row to the table body
        });
    })
    .catch(error => {
        console.error('Error:', error); // Log any errors
    });
