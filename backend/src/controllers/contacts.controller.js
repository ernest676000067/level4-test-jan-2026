const Contact = require('../models/Contact');
require('../models/User'); 


const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().populate('added_by', 'first_name last_name');
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const contacts = async (req, res) => {
      //1. Get data from req.body
  try {
      const data = req.body;
         const findContact = await Contact.findOne({full_name: data.full_name});
    if(findContact){
        return res.status(400).send({message: " contact name already exists"});
    }
    await Contact.create({...data});
    return res.status(201).send({message: " contact created successfully"});
    
  }catch (error) {
     console.log("Error:", error);
    return res.status(500).send({message: error.message});
  }

}



const createContact = async (req, res) => {
    try {
        const { full_name, phone, email, added_by } = req.body;
        const contact = new Contact({
            full_name,
            phone,
            email,
            added_by
        });
        const savedContact = await contact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateContact = async (req, res) => {
    try {
        const { full_name, phone, email, added_by } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { full_name, phone, email, added_by },
            { new: true, runValidators: true }
        );
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    contacts,
    getAllContacts,
    createContact,
    updateContact,
    deleteContact
};
