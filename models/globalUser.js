module.exports = function (sequelize, DataTypes) {
    var GlobalUser = sequelize.define("globalUser", {
      globalUserUUID: {
        type: DataTypes.STRING,
        primaryKey: true
        // validate: {
        //   //allowNull: false,
        //   notEmpty: true
        // }
      },
      globalUserFirstName: {
          type: DataTypes.STRING
          // validate: {
          //     isAlphanumeric: true,
          //     //allowNull: false,
          //     notEmpty: true
          // }
      },
      globalUserLastName: {
          type: DataTypes.STRING
          // validate: {
          //     isAlphanumeric: true,
          //     //allowNull: false,
          //     notEmpty: true
          // }
      },
      globalUserPhone: {
          type: DataTypes.STRING
          // validate: {
          //     not: ["[a-z]", 'i'],
          //     //allowNull: false,
          //     notEmpty: true
          // }
      },
      globalUserEmail: {
          type: DataTypes.STRING
          // validate: {
          //     isEmail: true,
          //     //allowNull: false,
          //     notEmpty: true
          // }
      },
      globalUserPassword: {
          type: DataTypes.STRING
          // validate: {
          //     //allowNull: false,
          //     notEmpty: true,
          //     len: [5]
          // }
      }
    }, {
        timestamps: false
    });

  return GlobalUser;
};
