import * as mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  age: Number,
  email: String,
  created_at: Number,
});

userSchema.pre('save', function(next) {
  if (this.isNew && this['created_at'] === undefined) {
    this['created_at'] = Date.now();
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
