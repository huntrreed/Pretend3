const express = require('express');
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
    hasPets,
    fencedYard,
    hasKids,
    previousExp,
    anythingElse,
    why,
  } = req.body;

  try {
    const newUser = await User.create({
      name,
      userName,
      email,
      password, // Make sure to hash the password before saving it
      fostering,
      hasPets,
      fencedYard,
      hasKids,
      previousExp,
      anythingElse,
      why,
    });

    // Assuming you have session middleware set up
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      // Redirect based on the fostering senior dogs response
      if (fostering === 'yes') {
        res.json({ redirectTo: '/allDogs' });
      } else {
        res.json({ redirectTo: '/youngDogs' });
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
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
