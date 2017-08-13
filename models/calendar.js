module.exports = function (sequelize, DataTypes) {
    var Calendar = sequelize.define("calendar", {
        calendarID: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        calendarName: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true,
                notNull: true,
                notEmpty: true,
                len: [5, 100]
            }
        },
        calendarDescription: DataTypes.TEXT,
        calendarOwner: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }
    }, {
        timestamps: false
    });

    return Calendar;
};
