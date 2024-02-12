const router = require('express').Router();
const { Dog, User } = require('../models');
const withAuth = require('../utils/auth');

// Route to render the homepage with all dogs
router.get('/', async (req, res) => {
  try {
    const dogsData = await Dog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    const dogs = dogsData.map((dog) => dog.get({ plain: true }));
    res.render('homepage', { dogs, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to render all dogs
router.get('/alldogs', async (req, res) => {
  try {
    const dogsData = await Dog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    const dogs = dogsData.map((dog) => dog.get({ plain: true }));
    res.render('allDogs', { dogs, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to render young dogs (under age 9)
router.get('/youngDogs', async (req, res) => {
  try {
    const dogsData = await Dog.findAll({
      where: {
        age: {
          [Sequelize.Op.lt]: 9, // Assuming 'age' is a column in your 'Dog' model
        },
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    const youngDogs = dogsData.map(dog => dog.get({ plain: true }));

    // Pass the youngDogs array to the 'youngDogs' view
    res.render('youngDogs', {
      dogs: youngDogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error('Error fetching young dogs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to render a specific dog's details
router.get('/dog/:id', async (req, res) => {
  try {
    const dogData = await Dog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    if (dogData) {
      const dog = dogData.get({ plain: true });
      res.render('dog', { dog, logged_in: req.session.logged_in });
    } else {
      res.status(404).send('Dog not found');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to render the form page (assuming 'yourInfo' is a form page)
router.get('/yourInfo', (req, res) => {
  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }
  res.render('yourInfo', { logged_in: req.session.logged_in });
});

// Route to render user's profile page
router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Dog }],
    });
    const user = userData.get({ plain: true });
    res.render('profile', { user, logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});

module.exports = router;
