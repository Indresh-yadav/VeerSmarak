const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema({
  name: String,
  category: { type: String, enum: ['Soldier', 'Freedom Fighter'] },
  image: String,
  story: String,
  birthDate: String,
  deathDate: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  imagePublicId: String
}, { timestamps: true });

module.exports = mongoose.model('Hero', HeroSchema);
