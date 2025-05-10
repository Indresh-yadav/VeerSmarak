const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedHeroes = require('./seed/seed');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const uploadRoute = require('./routes/upload');
const heroRoutes = require('./routes/heroRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', uploadRoute);
app.use('/api/hero', heroRoutes);
app.use('/api/users', userRoutes);

const startServer = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected.');
  
      await seedHeroes(); 
  
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };

startServer();
