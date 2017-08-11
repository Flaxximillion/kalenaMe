module.exports = function (sequelize, DataTypes) {
    var Calendar = sequelize.define("Calendar", {
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
      calendarDescription: DataTypes.TEXT
    }, {
      timestamps: false
    });

  return Calendar;
};
