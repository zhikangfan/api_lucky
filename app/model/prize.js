module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize;

  const Prize = app.model.define('prize', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: STRING(30),
      allowNull: false,
      unique: true,
      comment: '奖品名称',
    },
    desc: {
      type: STRING(128),
      allowNull: false,
      comment: '奖品描述',
    },
    type: {
      type: INTEGER,
      defaultValue: 0,
      comment: '0: 时间; 1: 次数;',
    },
    expires: {
      type: INTEGER,
      defaultValue: 0,
      comment: '过期时间，0时为永久，单位：秒',
    },
    usage_duration: {
      type: INTEGER,
      defaultValue: 0,
      comment: '生效时常，当type为时间类型时使用，单位：秒',
    },
    usage_count: {
      type: INTEGER,
      defaultValue: 0,
      comment: '使用次数，当type为次数类型时使用',
    },
    status: {
      type: BOOLEAN,
      defaultValue: true,
      comment: '奖品状态，true: 可用; false: 不可用',
    },
    creator_id: {
      type: INTEGER,
      allowNull: false,
      comment: '奖品创建者id',
      references: {
        model: app.model.User,
        key: 'id',
      },
    },
  }, { freezeTableName: true, timestamps: true });
  Prize.associate = function() {
    app.model.Prize.belongsTo(app.model.User, {
      foreignKey: 'creator_id',
      as: 'creator',
    });
    app.model.Prize.hasMany(app.model.UserPrize, {
      foreignKey: 'prize_id',
      as: 'user_prizes',
    });
  };
  return Prize;
};
