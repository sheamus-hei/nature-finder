'use strict';
module.exports = (sequelize, DataTypes) => {
  const usersAnimals = sequelize.define('usersAnimals', {
    animalId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  usersAnimals.associate = function(models) {
    // associations can be defined here
  };
  return usersAnimals;
};