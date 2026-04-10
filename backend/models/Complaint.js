const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
