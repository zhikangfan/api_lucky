module.exports = app => {
  const { INTEGER, BOOLEAN } = app.Sequelize;

  const UserPrize = app.model.define('user_prize', {
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
  }, { freezeTableName: true, timestamps: true });

  UserPrize.associate = function() {
    app.model.UserPrize.belongsTo(app.model.Prize, {
      foreignKey: 'prize_id',
      as: 'prize',
    });
    app.model.UserPrize.belongsTo(app.model.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };
  return UserPrize;
};
