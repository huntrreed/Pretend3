const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
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
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
    hasPets: {
      type: DataTypes.STRING,
      allowNull: false,
      // If you have a predefined set of pet types, you can use ENUM
      validate: {
        isIn: [['Other dog(s)', 'Cat(s)', 'Other Type of Pet(s)']], 
      },
    },
    fencedYard: {
      // all, size
      type: DataTypes.BOOLEAN,
      // allowNull: false,
    },
    hasKids: {
      /// kidFriendly
      type: DataTypes.BOOLEAN,
      // allowNull: false,
    },
    fostering: {
      /// age
      type: DataTypes.BOOLEAN,
      // allowNull: false,
    },
    previousExp: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['No Experience', 'Some experience but never owned one', 'I have owned a dog, but it was awhile ago', 'I have extensive experience caring for dogs']], 
      },
    },
    anythingElse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    why: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: true,
    modelName: 'users',
  }
);

module.exports = User;
