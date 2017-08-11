module.exports = function (sequelize, DataTypes) {
    var GlobalUser = sequelize.define("GlobalUser", {
      globalUserUUID: {
        type: DataTypes.STRING,
        primaryKey: true,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      globalUserFirstName: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
              isAlphanumeric: true,
              notNull: true,
              notEmpty: true
          }
      },
      globalUserLastName: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
              isAlphanumeric: true,
              notNull: true,
              notEmpty: true
          }
      },
      globalUserPhone: {
          type: DataTypes.STRING,
          validate: {
              not: ["[a-z]", 'i'],
              notNull: true,
              notEmpty: true
          }
      },
      globalUserEmail: {
          type: DataTypes.STRING,
          validate: {
              isEmail: true,
              notNull: true,
              notEmpty: true
          }
      },
      globalUserPassword: {
          type: DataTypes.STRING,
          validate: {
              notNull: true,
              notEmpty: true,
              len: [5]
          }
      }
    }, {
        timestamps: false
    });

  return GlobalUser;
};
