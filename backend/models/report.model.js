const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Report = sequelize.define('Report', {
    // 举报记录ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 举报者ID（关联 User）
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 被举报的内容ID（关联 Post）
    reportedContentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 举报类型，例如 "色情"、"诈骗" 等
    reportType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 举报描述
    reportDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 举报人联系方式（例如电话号码或邮箱）
    reporterContact: {
      type: DataTypes.STRING,
      allowNull: true,
    }    
  }, {
    tableName: 'Reports',
    timestamps: true,
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: 'reporterId', targetKey: 'id' });
    Report.belongsTo(models.Post, { foreignKey: 'reportedContentId', targetKey: 'id' });
  };

  return Report;
}; 