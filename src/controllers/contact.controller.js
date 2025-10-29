import Contact from "../models/contactForm.model.js";

// create contact
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message, terms } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
        data: null,
      });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email address",
        data: null,
      });
    }

    if (!terms) {
      return res.status(400).json({
        statrus: false,
        message: "You must accept the terms and conditions",
        data: null,
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      message,
      terms,
    });

    await newContact.save();

    return res.status(201).json({
      status: true,
      message: "Your message has been successfully sent",
      data: newContact,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
      data: null,
    });
  }
};

// get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalContacts = await Contact.countDocuments();

    const totalPages = Math.ceil(totalContacts / limit);

    return res.status(200).json({
      status: true,
      message: "Contacts fetched successfully",
      data: contacts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalContacts: totalContacts,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
      data: null,
    });
  }
};

// get individual contact
export const getSingleContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Contact fetched successfully",
      contact: contact,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// delete a contact
export const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findByIdAndDelete(contactId);

    if (!contact) {
      return res
        .status(404)
        .json({ status: false, message: "Contact not found", data: null });
    }

    return res.status(200).json({
      status: true,
      message: "Contact deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        status: false,
        message: "Server error",
        error: err.message,
        data: null,
      });
  }
};
