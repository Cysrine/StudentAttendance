const urlParams = new URLSearchParams(window.location.search);
const className = urlParams.get('class');
let currentDate = new Date();

function generateTableHeaders(date) 
{
    const headerRow = document.getElementById('header-row');
    const dataRow = document.getElementById('data-row');
    const tableBody = document.getElementById('table-body');
    const monthNameDiv = document.getElementById('month-name');
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //Clear the table 
    headerRow.innerHTML = '';
    dataRow.innerHTML = '';
    tableBody.innerHTML = '';

    monthNameDiv.textContent = `${className} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    const th = document.createElement('th');
    th.textContent = "Students";
    headerRow.appendChild(th);    
    for (let day = 1; day <= daysInMonth; day++) 
    {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    }

    fetch('http://localhost:3000/home')
    .then(response => response.json())
    .then(data => 
    {
        data.forEach(item => 
        {
            if(item.name === className)
            {
                const students = item.students;
                students.forEach(student => 
                {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    tableBody.appendChild(row);
                    cell.textContent = student.name;
                    row.appendChild(cell);
                    for(let day = 1; day <= daysInMonth; day++)
                        {
                            const cell = document.createElement('td');
                            cell.id = student.name + day;
                            row.appendChild(cell);
                        }
                    const attendance = student.attendance
                    attendance.forEach(entry => 
                    {
                        if(currentDate.getMonth() === new Date(entry.date).getMonth())
                        {
                            const day = new Date(entry.date).getDate();
                            const block = document.getElementById(student.name + day);
                            block.textContent = entry.status;
                        }
                        
                    })
                })
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
}

function changeMonth(offset) 
{
    currentDate.setMonth(currentDate.getMonth() + offset);
    generateTableHeaders(currentDate);
}

document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
generateTableHeaders(currentDate);