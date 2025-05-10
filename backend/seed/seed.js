const mongoose = require("mongoose");
require("dotenv").config();

const Hero = require("../models/Hero");
const User = require("../models/User");

const seedHeroes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const adminEmail = "a@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const admin = new User({
        name: "Admin",
        email: adminEmail,
        password: "123", 
        role: 'admin'
      });
      
      await admin.save(); 
      
      console.log(" Admin user created with hashed password:", admin.password);
    } else {
      console.log(" Admin already exists. Skipping admin seeding.");
    }
  } catch (error) {
    console.error(" Error in seeding:", error);
    process.exit(1);
  }
};

module.exports = seedHeroes;
