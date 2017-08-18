module.exports = function (sequelize, DataTypes) {
    var Task = sequelize.define("tasks", {
        taskCalendar: {
            type: DataTypes.STRING
        },
        taskName: {
            type: DataTypes.STRING
        },
        taskDescription: DataTypes.TEXT,
        taskAccepted: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        taskRequester: {
            type: DataTypes.STRING
        },
        taskAccepter: {
            type: DataTypes.STRING
        },
        taskDate: {
            type: DataTypes.DATE
        }
    });
    return Task;
};
