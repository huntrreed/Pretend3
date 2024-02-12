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
    headers: { 'Content-Type': 'application/json' }, // Tell the server we are sending JSON
    body: JSON.stringify(formData), // Convert the form data to JSON
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // Redirect based on the server response
      console.log(`Response: ${JSON.stringify(data)}`);
      window.location = '/dogs';
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
});