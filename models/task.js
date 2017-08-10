module.exports = function(sequelize, DataTypes){
  var Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        notNull: true,
        notEmpty: true,
        len: [5, 50],
      }
    },
    description: DataTypes.TEXT,
    taken: {
      type: DataTypes.BOOLEAN,
      default: false,
      validate: {
        notNull: true
      }
    },
    date_needed: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: true,
        notNull: true,
        isDate: true
      }
    }
  });

  //a task can't be created without an user

  Task.associate = function(models){
    Task.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Task;
};
