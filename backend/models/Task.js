const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, default: 'Pending' },
    assignedUser: String,
    priority: { type: String, default: 'Medium' },
    dueDate: Date,
    blockchainTxHash: String,
    blockchainTaskId: Number,
    jiraKey: String, // Add this field to store Jira issue key
    checklist: [{
        text: String,
        completed: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);