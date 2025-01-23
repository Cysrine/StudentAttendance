const urlParams = new URLSearchParams(window.location.search);
const className = urlParams.get('class');
let currentDate = new Date();
let studentNames = [];

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
                            cell.addEventListener('click', markPresent);
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
                            block.classList.add(entry.status);
                        }
                        
                    })
                    studentNames.push(student.name);
                })
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));
}

async function updateAttendance()
{
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    for(let i = 0; i < studentNames.length; i++)
    {
        for(let day = 1; day < daysInMonth; day++)
        {
            const update = document.getElementById(studentNames[i] + day);
            if(update.className)
            {
                const data = {
                    className: className,
                    student: studentNames[i],
                    attendance: {
                        date: currentDate.getFullYear() +"-"+currentDate.getMonth()+1+"-"+day,
                        status: update.className
                    }
                }
                await fetch('http://localhost:3000/update', {
                    method: 'PUT',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if(response.ok)
                    {
                        console.log("Attendance updated successfully");
                    }
                    else
                    {
                        console.log("Error updating attendance");
                    }
                })
                .catch(error => console.error('Caught Error', error));
                
            }
        
        }
    }
}

function changeMonth(offset) 
{
    currentDate.setMonth(currentDate.getMonth() + offset);
    generateTableHeaders(currentDate);
}
function markPresent(event)
{
    const cell = event.target;
    if(cell.classList.contains('present'))
    {
        cell.classList.add('absent');
        cell.classList.remove('present');
        cell.textContent = 'absent';
    }
    else if(cell.classList.contains('absent'))
    {
        cell.classList.add('ill');
        cell.classList.remove('absent');
        cell.textContent = 'ill';
    }
    else if(cell.classList.contains('ill'))
    {
        cell.classList.remove('ill');
        cell.textContent = '';
    }
    else
    {
        cell.classList.add('present');
        cell.textContent = 'present';
    }
}

document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
document.getElementById('updateButton').addEventListener('click', () => updateAttendance());
generateTableHeaders(currentDate);