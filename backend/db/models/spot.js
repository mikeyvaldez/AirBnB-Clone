'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {

    static associate(models) {
      // define association here
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId'})
      Spot.belongsTo( models.User, { foreignKey: 'ownerId', as:'Owner' })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    country: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Spot',
  })
  return Spot;
};
