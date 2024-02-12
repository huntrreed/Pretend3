const sequelize = require('../config/connection');
const { Dog, User } = require('../models');
const dogData = require('./dogData.json');
const userData = require('./userData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const dogs = await Dog.bulkCreate(dogData, {
    individualHooks: true,
    returning: true,
  });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // console.log(dogs);
  console.log(users);
  console.log('All dogs have been seeded!');

  process.exit(0);
};

seedDatabase();

