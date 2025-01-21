async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            message.textContent = 'Login successful';
            message.style.color = 'green';
            setTimeout(() => { window.location.href = 'home/home.html'; }, 3000);
        } else {
            message.textContent = 'Invalid username or password';
            message.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        message.textContent = 'Server error';
        message.style.color = 'red';
    }
}
