module.exports = function (sequelize, DataTypes) {
    var Task = sequelize.define("tasks", {
      taskID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      taskCalendar: {
        type: DataTypes.INTEGER,
        validate: {
          notNull: true,
          notEmpty: true,
          isNumeric: true
        }
      },
      taskName: {
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: true,
          notNull: true,
          notEmpty: true,
          len: [5, 100]
        }
      },
      taskDescription: DataTypes.TEXT,
      taskAccepted: {
        type: DataTypes.BOOLEAN,
        default: false,
        validate: {
          notNull: true
        }
      },
      taskRequester: {
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      taskAccepter: {
        type: DataTypes.STRING
      },
      taskDate: {
        type: DataTypes.DATEONLY,
        validate: {
          notEmpty: true,
          notNull: true,
          isDate: true
        }
      },
      taskTime: {
        type: DataTypes.TIME,
        validate: {
          notEmpty: true,
          notNull: true
        }
      }
    }, {
      timestamps: false
    });

  return Task;
};
