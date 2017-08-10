module.exports = function (sequelize, DataTypes) {
    var Calendar = sequelize.define("Calendar", {
        calendarName: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true,
                notNull: true,
                notEmpty: true,
                len: [5, 100]
            }
        },
        calendarDescription: DataTypes.TEXT
    }, {
        timestamps: false
    });

    Calendar.associate = function (models) {
        Task.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Task;
};