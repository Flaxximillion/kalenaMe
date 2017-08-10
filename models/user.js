//var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes){
  var User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: true,
        notNull: true,
        notEmpty: true,
        len: [5, 20]
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        not: ["[a-z]", 'i'],
        notNull: true,
        notEmpty: true,
        max: 11
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true,
        min: 7
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true,
        len: [5, 10]
      }
    }
  });

  // User.prototype.validPassword = function(password){
  //   return bcrypt.compareSync(password, this.password);
  // };
  //
  // User.hook("beforeCreate", function(user){
  //   user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  // });

  User.associate = function(models){
    User.hasMany(models.Task);
  };

  return User;
};
