module.exports = app => {
  const { DATE, INTEGER, BOOLEAN } = app.Sequelize;

  return app.model.define('invite_link', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    inviter: {
      type: INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    expires: {
      type: INTEGER,
      defaultValue: 5 * 60,
      comment: '过期时间，0时为永久，单位：秒',
    },
    type: {
      type: INTEGER,
      defaultValue: 0,
      comment: '0: 抽奖',
    },
    status: {
      type: BOOLEAN,
      defaultValue: true,
      comment: 'true: 可用; false: 不可用',
    },
    created_at: {
      type: DATE,
      defaultValue: app.Sequelize.NOW,
    },
    updated_at: {
      type: DATE,
      defaultValue: app.Sequelize.NOW,
    },
  }, { freezeTableName: true });
};
