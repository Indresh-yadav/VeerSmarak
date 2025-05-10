const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  savedHeroes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hero' }],
  likedHeroes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hero' }],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    console.error('Error hashing password:', err);
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);