module.exports = function (sequelize, DataTypes) {
    var Message = sequelize.define("Message", {
        messageText: {
            type: DataTypes.TEXT,
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
        }
    });

    //a message can't be created without a task
    Message.associate = function (models) {
        Message.belongsTo(models.Group, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Message;
};
