module.exports = function(sequelize, DataTypes){
  var Message = sequelize.define("Message", {
    text: {
      type: DataTypes.TEXT,
      validate: {
        notNull: true,
        notEmpty: true,
      }
    }
  });

  //a message can't be created without a task
  Message.associate = function(models){
    Message.belongsTo(models.Task, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Message;
};
