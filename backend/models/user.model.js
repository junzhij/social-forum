const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: '_create'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: '_update'
    },
    receivedLikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    followerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isSuperAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 100
      }
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: 'authorId',
      sourceKey: 'id',
      as: 'posts'
    });
    User.hasMany(models.Comment, { foreignKey: 'authorId' });
    User.hasMany(models.PostLike, { foreignKey: 'userId' });
  };

  return User;
}; 