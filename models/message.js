module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("messages", {
      userUUID: {
        type: DataTypes.STRING
      },
      userName: {
        type: DataTypes.STRING
      },
      messageCalendar: {
        type: DataTypes.STRING
      },
      messageText: {
        type: DataTypes.TEXT
      }
  });

  return Message;
};
