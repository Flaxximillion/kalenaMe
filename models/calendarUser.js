module.exports = function (sequelize, DataTypes) {
    var CalendarUser = sequelize.define("calendarUser", {
        calendarUserUUID: {
            type: DataTypes.STRING,
            validate: {
                //notNull: true,
                notEmpty: true
            }
        },
        calendarID: {
            type: DataTypes.STRING,
            validate: {
                //notNull: true,
                notEmpty: true
            }
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                notEmpty: true
            }
        }
    }, {timestamps: false});

    return CalendarUser;
};
