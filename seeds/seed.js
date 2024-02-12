const sequelize = require('../config/connection');
const { Dog } = require('../models');
const dogData = require('./dogData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true }); them

  const dogs = await Dog.bulkCreate(dogData, {
    individualHooks: true,
    returning: true,
  });

  console.log('All dogs have been seeded!');

  process.exit(0);
};

seedDatabase();

