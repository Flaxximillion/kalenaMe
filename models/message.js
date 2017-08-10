module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("Message", {
      messageID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      messageCalendar: {
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      messageSender: {
        type: DataTypes.STRING
      },
      messageReceiver: {
        type: DataTypes.STRING
      },
      messageBody: {
        type: DataTypes.TEXT,
        validate: {
            notNull: true,
            notEmpty: true
        }
      }
  });

  return Message;
};
