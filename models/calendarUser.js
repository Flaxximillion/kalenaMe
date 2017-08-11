module.exports = function (sequelize, DataTypes) {
    var CalendarUser = sequelize.define("calendarUser", {
        calendarUserUUID: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        calendarID: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }
    }, {timestamps: false});

    return CalendarUser;
};
