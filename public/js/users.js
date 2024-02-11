document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#get-started-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collecting form data
    const name = document.querySelector('#name').value.trim();
    const userName = document.querySelector('#username').value.trim(); // Ensure ID matches
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
    const reenteredPassword = document.querySelector('#reEnterPassword').value.trim();
    let fostering = document.querySelector('input[name="fostering"]:checked') ? document.querySelector('input[name="fostering"]:checked').value : null;
    const hasPets = document.querySelector('#hasPets').value;
    const fencedYard = document.querySelector('input[name="fencedYard"]:checked') ? document.querySelector('input[name="fencedYard"]:checked').value : null;
    const hasKids = document.querySelector('input[name="hasKids"]:checked') ? document.querySelector('input[name="hasKids"]:checked').value : null;
    const previousExp = document.querySelector('#previousExp').value;
    const anythingElse = document.querySelector('#anythingElse').value.trim();
    const why = document.querySelector('#why').value.trim();

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
      name,
      userName,
      email,
      password, // Assuming you handle hashing on the server-side
      fostering,
      hasPets: parseInt(hasPets),
      fencedYard: fencedYard === 'true',
      hasKids: hasKids === 'true',
      previousExp: parseInt(previousExp),
      anythingElse,
      why
    };

    // Fetch API call to send data to the server
    fetch('/api/users/get-started-form', { // Adjust this URL to your endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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
});
