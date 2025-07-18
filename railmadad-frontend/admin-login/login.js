   function togglePassword() {
      const input = document.getElementById('password');
      const btn = document.querySelector('.password-toggle');
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
      } else {
        input.type = 'password';
        btn.textContent = 'Show';
      }
    }
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginButton = document.querySelector(".login-button");

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
    if (emailInput.value.trim() && passwordInput.value.trim()) {
      loginButton.disabled = false;
      loginButton.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
      loginButton.style.cursor = 'pointer';
    } else {
      loginButton.disabled = true;
      loginButton.style.background = '#ccc';
      loginButton.style.cursor = 'not-allowed';
    }
  }

  emailInput.addEventListener("input", updateButtonState);
  passwordInput.addEventListener("input", updateButtonState);
