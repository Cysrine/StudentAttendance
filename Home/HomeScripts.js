const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
console.log("User Home = ", user);

fetch('http://localhost:3000/home', {
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
    const classContainer = document.getElementById('classCards');
    classContainer.innerHTML = '';
    
    let row;
    data.forEach((item, index) => {
        if (index % 5 === 0) {
            row = document.createElement('div');
            row.classList.add('class-row');
            classContainer.appendChild(row);
        }
        
        const card = document.createElement('div');
        card.classList.add('class-card');
        
        const icon = document.createElement('img');
        icon.src = 'icons/'+item.icon+'.png' || 'icons/default.png';
        icon.alt = `${item.icon} icon`;
        icon.style.width = '40px';
        icon.style.height = '40px';
        
        const link = document.createElement('a');
        link.href = `../Calender/Calender.html?class=${encodeURIComponent(item.name)}&user=${encodeURIComponent(user)}`;
        link.textContent = item.name;
        
        card.appendChild(icon);
        card.appendChild(link);
        row.appendChild(card);
    });
})
.catch(error => {
    console.error('Error:', error);
});

function genReport() {
    window.location.href=`../Report/reportPage.html?user=${encodeURIComponent(user)}`;
}
function createClass() {
    window.location.href = `../CLass/class_creation.html?user=${encodeURIComponent(user)}`;
}
