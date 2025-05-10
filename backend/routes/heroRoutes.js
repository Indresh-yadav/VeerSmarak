const express = require('express');
const router = express.Router();
const { getHeroes,getHero, createHero, saveHero, likeHero, commentOnHero, getHeroById, updateHero, deleteHero } = require("../controllers/heroControllers");
const {protect} = require('../middleware/authMiddleware');

router.get('/',protect, getHeroes);          
router.get('/heroes', getHero);
router.get('/heroes/:id', protect, getHeroById);
router.post('/heroes', protect, createHero); 
router.put('/heroes/:id', protect, updateHero);
router.delete('/heroes/:id',protect, deleteHero)
router.post('/heroes/:id/save', protect, saveHero); 
router.post('/heroes/:id/like', protect, likeHero);
router.post('/heroes/:id/comment', protect, commentOnHero); 

module.exports = router;
