const mongoose = require('mongoose');


const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    next();
};


const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
};

module.exports = { validateObjectId, errorHandler };
