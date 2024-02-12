const fs = require('fs').promises;
const router = require('express').Router();
const withAuth = require('../utils/auth');

// Helper function to read dog data from JSON file
async function getDogData() {
  const dogDataJson = await fs.readFile('path/to/your/dogData.json', 'utf8');
  return JSON.parse(dogDataJson);
}

// Helper function to find a dog by id from JSON data
async function findDogById(id) {
  const dogs = await getDogData();
  return dogs.find(dog => dog.id.toString() === id);
}

// Route to render the homepage with all dogs
router.get('/', async (req, res) => {
  try {
    const dogs = await getDogData();
    res.render('homepage', { dogs, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dog data' });
  }
});

// Route to render all dogs
router.get('/alldogs', async (req, res) => {
  try {
    const dogs = await getDogData();
    res.render('allDogs', { dogs, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dog data' });
  }
});

// Route to render young dogs (under age 9)
router.get('/youngDogs', async (req, res) => {
  try {
    const allDogs = await getDogData();
    const youngDogs = allDogs.filter(dog => parseInt(dog.age) < 9);
    res.render('youngDogs', { dogs: youngDogs, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load young dogs data' });
  }
});

// Route to render a specific dog's details
router.get('/dog/:id', async (req, res) => {
  try {
    const dog = await findDogById(req.params.id);
    if (dog) {
      res.render('dog', { dog, logged_in: req.session.logged_in });
    } else {
      res.status(404).send('Dog not found');
    }
  } catch (err) {
    res.status(500).json(err);
  }
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

// Route for login pages
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});

// Added route for "Get Started" page to render the form
router.get('/getStarted', async (req, res) => {
  try {
    res.render('yourInfo'); 
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
