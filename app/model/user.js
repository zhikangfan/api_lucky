module.exports = app => {
    const {STRING, DATE, INTEGER, BOOLEAN} = app.Sequelize;

    const User = app.model.define('user', {
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
        companion: {
            type: INTEGER,
            allowNull: true,
            references: {
                model: 'user', // 指向 users 表
                key: 'id', // 指向 id 字段
            },
        },
        last_sign_in_at: {
            type: DATE,
            defaultValue: app.Sequelize.NOW,
        },
        status: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {freezeTableName: true, timestamps: true});
    User.associate = function () {
        app.model.User.belongsTo(app.model.User, {
            foreignKey: 'companion',
            as: 'companion_user',
        });
        app.model.User.hasMany(app.model.UserPrize, {
            foreignKey: 'user_id',
            as: 'user',
        });
        app.model.User.hasMany(app.model.Prize, {
            foreignKey: 'creator_id',
            as: 'user_prizes',
        });
    };
    return User;
};
