'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {

    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as:'Owner' })
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    allowNull: false,
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 255]
      }
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 30]
      }
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 30]
      }
    },
    country: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 30]
      }
    },
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 50]
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    avgRating: {
      type: DataTypes.DECIMAL
    },
    previewImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
