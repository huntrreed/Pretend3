const express = require('express');
const bcrypt = require('bcrypt'); // To hash passwords
const router = express.Router();
const { User } = require('../../models');

// Route for handling user registration form submission
router.post('/get-started-form', async (req, res) => {
  const {
    name,
    userName,
    email,
    password,
    fostering,
  } = req.body;

  // Ensure all required fields are provided
  if (!name || !userName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
      fostering,
    });

    // Set user session upon successful registration
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      // Redirect based on the fostering preference
      res.json({ redirectTo: fostering === 'yes' ? '/allDogs' : '/youngDogs' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Route for handling user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      return res.status(400).json({ message: 'Incorrect email or password, please try again' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect email or password, please try again' });
    }

    // Set user session upon successful login
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Route for handling user logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
