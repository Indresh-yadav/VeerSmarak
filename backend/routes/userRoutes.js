const express = require('express');
const router = express.Router();
const { getSavedPosts, getLikedPosts} = require("../controllers/userControllers");
const { protect } = require('../middleware/authMiddleware');

router.get('/saved/:id', protect, getSavedPosts);
router.get('/liked/:id', protect, getLikedPosts);

module.exports = router;