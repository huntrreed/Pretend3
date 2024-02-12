document.getElementById('get-started-form').addEventListener('submit', function(event) {
  event.preventDefault();
  console.log('Form submitted');
  // Define password and reenteredPassword before formData for validation
  const password = document.getElementById('password').value.trim();
  const reenteredPassword = document
    .getElementById('reEnterPassword')
    .value.trim();

  // Validation checks
  if (password !== reenteredPassword) {
    alert('Passwords do not match.');
    return;
  }

  if (password.length < 8) {
    alert('Password must be at least 8 characters long.');
    return;
  }

  const formData = {
    name: document.getElementById('name').value.trim(),
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value.trim(),
    reenteredPassword: document.getElementById('reEnterPassword').value.trim(),
    allowSenior: document.querySelector('input[name="allowSenior"]:checked')
      .value,
  };

  fetch('/api/users/get-started-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  .then(response => {
    if (response.redirected) {
      window.location.href = response.url;
      return;
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Handle JSON data
    window.location = '/profile'; // Redirect on success
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  });