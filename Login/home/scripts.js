// Fetch the JSON data and populate the table
fetch('http://localhost:3000/home')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('classTable');
        // Loop through the data and create rows with only the 'name' field
        data.forEach(item => {
            const row = document.createElement('tr'); // Create a new table row
            const cell = document.createElement('td'); // Create a single cell
            cell.textContent = item.name; // Add the name value to the cell
            row.appendChild(cell); // Append the cell to the row
            tableBody.appendChild(row); // Append the row to the table body
        });
    })
    .catch(error => console.error('Error fetching data:', error));