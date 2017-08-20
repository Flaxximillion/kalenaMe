module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("messages", {
      userUUID: {
        type: DataTypes.STRING
      },
      firstName: {
        type: DataTypes.STRING
      },
      messageCalendar: {
        type: DataTypes.STRING
      }
  });

  return Message;
};
