const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const newCategory = new Category({ name: req.body.name });
        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
