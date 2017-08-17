module.exports = function (sequelize, DataTypes) {
    var CalendarUser = sequelize.define("calendarUser", {
        calendarUserUUID: {
            type: DataTypes.STRING
        },
        calendarUserEmail: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        calendarID: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                notEmpty: true
            }
        },
        isOwner: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                notEmpty: true
            }
        }
    }, {timestamps: false});

    

    return CalendarUser;
};
