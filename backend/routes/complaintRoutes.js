const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newComplaint = new Complaint({
            title,
            description,
            category,
            createdBy: req.user.id
        });
        const complaint = await newComplaint.save();
        
        req.io.emit('new_complaint', await complaint.populate('createdBy', 'name email')); // Notification socket
        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        if(req.user.role === 'admin') {
            const complaints = await Complaint.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
            return res.json(complaints);
        }
        const complaints = await Complaint.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const { status, adminNotes } = req.body;
        const complaint = await Complaint.findById(req.params.id);
        if(!complaint) return res.status(404).json({ msg: 'Complaint not found' });
        
        if (status) complaint.status = status;
        if (adminNotes) complaint.adminNotes = adminNotes;
        
        await complaint.save();
        const populatedComplaint = await complaint.populate('createdBy', 'name email');
        
        req.io.emit('status_update', { id: complaint._id, status: complaint.status, adminNotes: complaint.adminNotes, user: complaint.createdBy });
        res.json(populatedComplaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
