//var bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        userFirstName: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: true,
                notNull: true,
                notEmpty: true
            }
        },
        userLastName: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: true,
                notNull: true,
                notEmpty: true
            }
        },
        userPhone: {
            type: DataTypes.STRING,
            validate: {
                not: ["[a-z]", 'i'],
                notNull: true,
                notEmpty: true
            }
        },
        userEmail: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
                notNull: true,
                notEmpty: true
            }
        },
        userPassword: {
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

    // User.prototype.validPassword = function(password){
    //   return bcrypt.compareSync(password, this.password);
    // };
    //
    // User.hook("beforeCreate", function(user){
    //   user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    // });

    User.associate = function (models) {
        User.hasMany(models.Calendar);
    };

    return User;
};
