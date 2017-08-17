module.exports = function (sequelize, DataTypes) {
    var Calendar = sequelize.define("calendar", {
        calendarId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        calendarName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        calendarDescription: {
          type: DataTypes.TEXT
        },
        calendarOwner: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });

    return Calendar;
};
