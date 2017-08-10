module.exports = function (sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
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
        taskDateNeeded: {
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

    Task.associate = function (models) {
        Task.belongsTo(models.Calendar, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Task;
};
