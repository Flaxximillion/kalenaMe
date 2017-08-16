module.exports = function (sequelize, DataTypes) {
    var Calendar = sequelize.define("calendar", {
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
            // validate: {
            //     notEmpty: true
            // }
        }
    }, {
        timestamps: false
    });

    return Calendar;
};
