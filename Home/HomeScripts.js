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
    
    const iconMap = {
        'Mathematics': 'icons/math.png',
        'Physics': 'icons/phys.png',
        'Literature': 'icons/lit.png',
        'Astrology': 'icons/astr.png',
        'Sport': 'icons/sport.png'
    };
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('class-card');
        
        const icon = document.createElement('img');
        icon.src = iconMap[item.name] || 'icons/default.png';
        icon.alt = `${item.name} icon`;
        icon.style.width = '40px';
        icon.style.height = '40px';
        
        const link = document.createElement('a');
        link.href = `../Calender/Calender.html?class=${encodeURIComponent(item.name)}&user=${encodeURIComponent(user)}`;
        link.textContent = item.name;
        
        card.appendChild(icon);
        card.appendChild(link);
        classContainer.appendChild(card);
    });
})
.catch(error => {
    console.error('Error:', error);
});

function createClass() {
    window.location.href = `../CLass/class_creation.html?user=${encodeURIComponent(user)}`;
}