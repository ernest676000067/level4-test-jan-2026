const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const contactController = require('./src/controllers/contacts.controller');
const userController = require('./src/controllers/user.controller');

const { contactValidation } = require('./validations/contact.validation');
const { userValidation } = require('./validations/user.validation');

// Import middleware
const { validateObjectId, errorHandler } = require('./middlewares/middleware');


mongoose.connect(process.env.mongodb_url)
    .then(() => {
        console.log('Connected to MongoDB');

        const app = express();
        const PORT = process.env.port || 5000;
        
        // Enable CORS for frontend
        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true
        }));
    
        app.use(express.json());

       
        

        // Contact routes
        app.get('/contacts', contactController.getAllContacts);
        app.post('/contacts', contactValidation, contactController.createContact);
        app.put('/contacts/:id', validateObjectId, contactValidation, contactController.updateContact);
        app.delete('/contacts/:id', validateObjectId, contactController.deleteContact);

        // User routes
        app.get('/users', userController.getAllUsers);
        app.post('/users', userValidation, userController.user);
        app.put('/users/:id', validateObjectId, userValidation, userController.updateUser);
        app.delete('/users/:id', validateObjectId, userController.deleteUser);

    
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });

