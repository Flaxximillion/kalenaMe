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
      calendarUserFirstName: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
              isAlphanumeric: true,
              notNull: true,
              notEmpty: true
          }
      },
      calendarUserLastName: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
              isAlphanumeric: true,
              notNull: true,
              notEmpty: true
          }
      },
      calendarUserPhone: {
          type: DataTypes.STRING,
          validate: {
              not: ["[a-z]", 'i'],
              notNull: true,
              notEmpty: true
          }
      },
      calendarUserEmail: {
          type: DataTypes.STRING,
          validate: {
              isEmail: true,
              notNull: true,
              notEmpty: true
          }
      }
    }, {
        timestamps: false
    });

  return CalendarUser;
};
