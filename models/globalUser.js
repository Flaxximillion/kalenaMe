module.exports = function (sequelize, DataTypes) {
    var GlobalUser = sequelize.define("GlobalUser", {
      globalUserUUID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
          notEmpty: true
        }
      },
      globalUserFirstName: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
              isAlphanumeric: true,
              notEmpty: true
          }
      },
      globalUserLastName: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
              isAlphanumeric: true,
              notEmpty: true
          }
      },
      globalUserPhone: {
          type: DataTypes.STRING,
          validate: {
              not: ["[a-z]", 'i'],
              notEmpty: true
          }
      },
      globalUserEmail: {
          type: DataTypes.STRING,
          validate: {
              isEmail: true,
              notEmpty: true
          }
      },
      globalUserPassword: {
          type: DataTypes.STRING,
          validate: {
              notEmpty: true,
              len: [5]
          }
      }
    }, {
        timestamps: false
    });

  return GlobalUser;
};
