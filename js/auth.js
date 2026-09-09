const loginForm = document.querySelector('#loginForm');
const adminPassword = 'admin123';

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const role = document.querySelector('#role').value;
    const password = document.querySelector('#password').value;
    const message = document.querySelector('#loginMessage');

    if (!username || !role) {
      message.textContent = 'Please complete both fields.';
      return;
    }

    if (role === 'Admin' && password !== adminPassword) {
      message.textContent = 'Incorrect Admin password.';
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify({ username, role, authenticated: true }));
    window.location.href = role === 'Admin' ? '../admin/dashboard.html' : 'tasks.html';
  });
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

window.logout = logout;
