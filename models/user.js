var mongoose = require('mongoose'),
    db       = mongoose.connection,
    bcrypt   = require('bcrypt-nodejs');

UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
    bcrypt: true,
    required: true
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileImage: {
    type: String
  }
});

UserSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('password')) return next();

  user.password = bcrypt.hashSync(user.password);
  return next();
});

UserSchema.methods.compare = function(password){
  return bcrypt.compareSync(password, this.password);
};

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(user, cb) {
  user.save(cb);
}