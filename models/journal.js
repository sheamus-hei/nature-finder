'use strict';
module.exports = (sequelize, DataTypes) => {
  const journal = sequelize.define('journal', {
    animalId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    content: DataTypes.TEXT,
    img: DataTypes.STRING
  }, {});
  journal.associate = function(models) {
    // associations can be defined here
    models.journal.belongsTo(models.user);
    models.journal.belongsTo(models.animal);
  };
  return journal;
};