const User = require('../models/User');

const user = async (req, res) => {
    //1. Get data from req.body
    try {
        const data = req.body;
        const findUser = await User.findOne({ first_name: data.first_name, last_name: data.last_name });
        if (findUser) {
            return res.status(400).send({ message: " User already exists" });
        }
        await User.create({ ...data });
        return res.status(201).send({ message: " User created successfully" });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).send({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            message: 'Users fetched successfully',
            data: users
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    user,
    getAllUsers,
    updateUser,
    deleteUser
};

