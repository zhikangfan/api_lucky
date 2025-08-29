module.exports = app => {
  const { STRING, DATE, INTEGER, BOOLEAN } = app.Sequelize;

  return app.model.define('user', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nickname: {
      type: STRING(30),
      allowNull: false,
    },
    avatar: {
      type: STRING(128),
      allowNull: true,
      defaultValue: '',
    },
    account: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: STRING,
      allowNull: false,
    },
    balance: {
      type: INTEGER,
      defaultValue: 0,
      comment: '用户余额',
    },
    lottery_chances: {
      type: INTEGER,
      defaultValue: 0,
      comment: '用户抽奖机会',
    },
    last_sign_in_at: {
      type: DATE,
      defaultValue: app.Sequelize.NOW,
    },
    companion: {
      type: INTEGER,
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
