module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    banReason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    banExpireAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });
  
  return User;
}; 