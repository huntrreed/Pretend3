const express = require('express');
const bcrypt = require('bcrypt'); // to hash passwords
const router = express.Router();
const { User } = require('../../models');

// Route for handling the form submission
router.post('/get-started-form', async (req, res) => {
  const {
    name,
    userName,
    email,
    password,
    fostering,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password
    const newUser = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
      fostering,
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      // Redirect based on the fostering senior dogs response
      res.json({ redirectTo: fostering === 'yes' ? '/allDogs' : '/youngDogs' });
    });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const validationErrors = err.errors.map((error) => error.message);
      res.status(400).json({ errors: validationErrors });
    } else {
      console.error(err);
      res.status(500).json({ error: 'An internal server error occurred.' });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

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
