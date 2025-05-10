const Hero = require("../models/Hero");
const User= require("../models/User");

const getHeroes = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const heroes = await Hero.find().sort({ createdAt: -1 }).lean();
    const updatedHeroes = heroes.map(hero => {
      const likedByUser = hero.likedBy.map(id => id.toString()).includes(userId);
      const savedByUser = hero.savedBy.map(id => id.toString()).includes(userId);
      return {
        ...hero,
        isLiked: likedByUser,
        isSaved: savedByUser
      };
    });

    res.json({ heroes: updatedHeroes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching heroes" });
  }
};

const getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id).populate("comments.user", "name");

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.json({ hero });
  } catch (err) {
    res.status(500).json({ message: "Error fetching hero", error: err.message });
  }
};


const createHero = async (req, res) => {
  try {
    const hero = new Hero(req.body);
    await hero.save();
    res.status(201).json(hero);
  } catch (err) {
    res.status(400).json({ message: "Error creating hero" });
  }
};

const updateHero = async (req, res) => {
  try {
    const { name, story, category, birthDate, deathDate } = req.body;
    const updated = await Hero.findByIdAndUpdate(
      req.params.id,
      { name, story, category, birthDate, deathDate },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.json({ message: "Hero updated successfully", hero: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating hero", error: err.message });
  }
};


const getHero = async (req, res) => {
  try {
    const heroes = await Hero.find({
      name: { $regex: req.query.search, $options: "i" } 
    });

    if (!heroes || heroes.length === 0) {
      return res.status(404).json({ message: "Hero not found" });
    }

    res.json({
      hero: heroes 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching hero" });
  }
};


const saveHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedHeroes.includes(hero._id);

    if (!alreadySaved) {
      user.savedHeroes.push(hero._id);
      hero.savedBy.push(user._id); 
    } else {
      user.savedHeroes = user.savedHeroes.filter(id => id.toString() !== hero._id.toString());
      hero.savedBy = hero.savedBy.filter(id => id.toString() !== user._id.toString()); 
    }

    await user.save();
    await hero.save();

    return res.json({
      message: alreadySaved ? "Post unsaved." : "Post saved.",
      isSaved: !alreadySaved
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error toggling save", error: err.message });
  }
};



const likeHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    const user = await User.findById(req.user._id);

    const alreadyLiked = hero.likedBy.includes(user._id);

    if (!alreadyLiked) {
      hero.likes += 1;
      hero.likedBy.push(user._id);
      user.likedHeroes.push(hero._id);
    } else {
      hero.likes = Math.max(0, hero.likes - 1);
      hero.likedBy = hero.likedBy.filter(id => id.toString() !== user._id.toString());
      user.likedHeroes = user.likedHeroes.filter(id => id.toString() !== hero._id.toString());
    }

    await hero.save();
    await user.save();

    return res.json({
      message: alreadyLiked ? "Post unliked." : "Post liked.",
      likes: hero.likes,
      isLiked: !alreadyLiked
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating like", error: err.message });
  }
};



const commentOnHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id).populate('comments.user', 'name email');

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    hero.comments.push({
      user: req.user.id,
      message: req.body.message,  
      createdAt: new Date()
    });

    await hero.save();

    res.status(201).json({ message: "Comment added successfully", comments: hero.comments });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

const deleteHero= async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }
    if (hero.imagePublicId) {
      await cloudinary.uploader.destroy(hero.imagePublicId);
    }
    res.status(200).json({ message: "Hero deleted successfully" });
  } catch (err) {
    console.error("Error deleting hero:", err);
    res.status(500).json({ message: "Server error while deleting hero" });
  }
};


module.exports = {
  getHeroes,
  createHero,
  getHero,
  saveHero,
  likeHero,
  commentOnHero,
  getHeroById,
  updateHero,
  deleteHero
};
