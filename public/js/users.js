document.getElementById('get-started-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Define password and reenteredPassword before formData for validation
    const password = document.getElementById('password').value.trim();
    const reenteredPassword = document.getElementById('reEnterPassword').value.trim();
  
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
      reenteredPassword: document.getElementById('reEnterPassword').value.trim(), // ID should match the HTML
      fostering: document.querySelector('input[name="fostering"]:checked').value,
      hasPets: document.getElementById('hasPets').value, // Assuming this is a select dropdown
      fencedYard: document.querySelector('input[name="fencedYard"]:checked').value,
      hasKids: document.querySelector('input[name="hasKids"]:checked').value,
      previousExp: document.getElementById('previousExp').value, // Assuming this is a select dropdown
      anythingElse: document.getElementById('anythingElse').value.trim(),
      why: document.getElementById('why').value.trim(),
    };
  

    // Validation checks
    if (password !== reenteredPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    fetch(this.action, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(formData) // Convert the form data to JSON
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      // Redirect based on the server response
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
  });