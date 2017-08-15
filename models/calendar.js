module.exports = function (sequelize, DataTypes) {
    var Calendar = sequelize.define("calendar", {
        calendarname: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true,
                notEmpty: true,
                len: [1, 100]
            }
        },
        calendardescription: DataTypes.TEXT,
        calendarowner: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        }
    }, {
        timestamps: false
    });

    return Calendar;
};
