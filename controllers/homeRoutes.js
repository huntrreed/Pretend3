// const fs = require('fs').promises;
const router = require('express').Router();
const withAuth = require('../utils/auth');
const { Dog, User } = require('../models');
const { Op, json } = require('sequelize');

// // Helper function to read dog data from JSON file
// async function getDogData() {
//   const dogDataJson = await fs.readFile('dogData.json', 'utf8');
//   return JSON.parse(dogDataJson);
// }

// // Helper function to find a dog by id from JSON data
// async function findDogById(id) {
//   const dogs = await getDogData();
//   return dogs.find(dog => dog.id.toString() === id);
// }

router.get('/', async (req, res) => {
  try {
    // Get all dogs and JOIN with user data
    // const dogsData = await Dog.findAll({
    //   include: [
    //     {
    //       model: User,
    //       attributes: ['name'],
    //     },
    //   ],
    // });

    // Serialize data so the template can read it
    // const dogs = dogsData.map((dog) => dog.get({ plain: true }));

    //filter dogs array for conditions when needed
    //dogs = dogs.filter(dog => dog.age > 9)
    // Pass serialized data and session flag into template
    console.log(req.session);
    res.render('homepage.handlebars', {
      // dogs,
      session: req.session,
    });

    console.log('Rendered homepage');
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dog data' });
  }
});


// Route handles rendering dogs based on user's preferences
router.get('/dogs', async (req, res) => {
  try {
    const userId = req.session.user_id;

    // Find the user with the given ID
    const user = await User.findByPk(userId, {
      attributes: ['allowSenior'],
    });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this id!' });
    }

    // Get the allowSenior flag from the user
    const allowSenior = user.allowSenior;
    // Define the where condition based on the allowSenior flag
    const whereCondition = allowSenior ? {} : { age: { [Op.lt]: 9 } };

    // Fetch dogs based on the allowSenior flag
    const dogsData = await Dog.findAll({
      where: whereCondition,
    });

    const dogs = dogsData.map((dog) => dog.get({ plain: true }));
    console.log('Dogs:', dogs);

    console.log('Dogs:', dogs);
    // Render the page with the dogs information
    res.render('dogs.handlebars', {
      dogs, // Pass the enhanced dogs array
      session: req.session,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to load dog data' });
  }
});

router.get('/dog/:id', async (req, res) => {
  try {
    const dogData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const dog = dogData.get({ plain: true });

    res.render('dog.handlebars', {
      ...dog,
      session: req.session,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//if user is not logged in they are directed to login page
router.get('/profile', withAuth, async (req, res) => {
  console.log(req.session);
  try {
    if (!req.session.logged_in) {
      res.redirect('/login');
      return;
    }
    // Find the logged in user based on the session ID
  const userData = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ['password'] },
   
  });
  if (!userData) {
    // user data is not found sends error
    res.status(404).json({ message: "User not found" });
    return;
  }

    const user = userData.get({ plain: true });
    res.render('profile.handlebars', {
      user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// Added route for "Get Started" page to render the form
router.get('/getStarted', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }

    res.render('yourInfo');
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
