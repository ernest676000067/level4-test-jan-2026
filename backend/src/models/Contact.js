const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        maxlength: 50
    },
    phone: {
        type: String,
        maxlength: 20
    },
    email: {
        type: String,
        maxlength: 50
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);

