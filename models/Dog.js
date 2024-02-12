const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Dog extends Model {}

Dog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    // TODO: possibly change integer to string?
    energyLevel: {
      type: DataTypes.STRING,
    },
    kidFriendly: {
      type: DataTypes.BOOLEAN,
    },
    otherDogFriendly: {
      type: DataTypes.BOOLEAN,
    },
    spayedNeutered: {
      type: DataTypes.BOOLEAN,
    },
    weight: {
      type: DataTypes.STRING,
    },
    specialMedNeeds: {
      type: DataTypes.BOOLEAN,
    },
    image: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'dog',
  }
);

module.exports = Dog;