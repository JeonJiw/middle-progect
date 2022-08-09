'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Posts, {
        as: "posts",
        foreignKey: "userId",
        // onUpdate: defaults to CASCADE
        onDelete: "cascade",
      });
    }
  }

  Users.init(
    {
      userId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nickname: {
        required: true,
        type: DataTypes.STRING,
      },
      password: {
        required: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Users',
    }
  );
  return Users;
};
