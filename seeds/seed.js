const sequelize = require('../config/connection');
const { Dog } = require('../models');
const dogData = require('./dogData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true }); // Warning: this will drop your tables and recreate them

  const dogs = await Dog.bulkCreate(dogData, {
    individualHooks: true,
    returning: true,
  });

  console.log('All dogs have been seeded!');

  process.exit(0);
};

seedDatabase();
