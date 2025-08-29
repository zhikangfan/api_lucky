module.exports = app => {
  const { DATE, INTEGER, BOOLEAN } = app.Sequelize;

  return app.model.define('user_relations', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    own_id: {
      type: INTEGER,
      allowNull: false,
      unique: 'user_id_friend_id_unique',
    },
    companion_id: {
      type: INTEGER,
      allowNull: false,
      unique: 'user_id_friend_id_unique',
    },
    status: {
      type: BOOLEAN,
      defaultValue: true,
    },
    created_at: DATE,
    updated_at: DATE,

  }, { freezeTableName: true });
};
