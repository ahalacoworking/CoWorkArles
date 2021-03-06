'use strict';
module.exports = (sequelize, DataTypes) => {
  const Achat = sequelize.define('Achat', {
    idUser: DataTypes.INTEGER,
    idForf: DataTypes.INTEGER,
      createdAt: DataTypes.DATE
  }, {});
  Achat.associate = function(models) {
    // associations can be defined here
      models.Achat.belongsTo(models.User, {
          foreignKey:'id'
      });
      models.Achat.belongsTo(models.Forfait, {
          foreignKey:'id'
      });
  };
  return Achat;
};