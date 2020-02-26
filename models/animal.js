'use strict';
module.exports = (sequelize, DataTypes) => {
  const animal = sequelize.define('animal', {
    speciesKey: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  animal.associate = function(models) {
    // associations can be defined here
    models.animal.hasMany(models.journal);
    models.animal.belongsToMany(models.user, {through: "usersAnimals"});
  };
  return animal;
};