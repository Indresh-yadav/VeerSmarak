const Hero = require("../models/Hero");
const User = require("../models/User");

const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const heroes = await Hero.find({ _id: { $in: user.savedHeroes } }).lean();

    const userId = user._id.toString();

    const updatedHeroes = heroes.map(hero => ({
      ...hero,
      isLiked: hero.likedBy.map(id => id.toString()).includes(userId),
      isSaved: true 
    }));

    res.json(updatedHeroes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching saved posts" });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const heroes = await Hero.find({ _id: { $in: user.likedHeroes } }).lean();

    const userId = user._id.toString();

    const updatedHeroes = heroes.map(hero => ({
      ...hero,
      isLiked: true,
      isSaved: hero.savedBy.map(id => id.toString()).includes(userId)
    }));

    res.json(updatedHeroes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching liked posts" });
  }
};



module.exports = { getSavedPosts, getLikedPosts };
