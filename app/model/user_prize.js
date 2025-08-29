module.exports = app => {
  const { DATE, INTEGER, BOOLEAN } = app.Sequelize;

  return app.model.define('user_prize', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    prize_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'prize',
        key: 'id',
      },
    },
    write_off: {
      type: BOOLEAN,
      defaultValue: false,
      comment: '是否使用',
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
