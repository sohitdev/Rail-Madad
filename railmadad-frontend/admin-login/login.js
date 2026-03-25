const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.querySelector('.login-button');
const loginForm = document.getElementById('adminLoginForm');

function togglePassword() {
  const btn = document.querySelector('.password-toggle');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    btn.textContent = 'Hide';
  } else {
    passwordInput.type = 'password';
    btn.textContent = 'Show';
  }
}

function updateButtonState() {
  const ready = emailInput.value.trim() && passwordInput.value.trim();
  loginButton.disabled = !ready;
  loginButton.style.background = ready ? 'linear-gradient(135deg, #dc3545, #c82333)' : '#ccc';
  loginButton.style.cursor = ready ? 'pointer' : 'not-allowed';
}

emailInput.addEventListener('input', updateButtonState);
passwordInput.addEventListener('input', updateButtonState);

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (loginButton.disabled) {
    return;
  }
  window.location.href = '/Admin-Portal/';
});

updateButtonState();
