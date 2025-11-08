import ContactInfo from "../models/contactInfo.model.js";

// create contact info
export const createContactInfo = async (req, res) => {
  try {
    const { address, email, openingHours, phoneNumbers } = req.body;

    let phoneList = phoneNumbers;

    if (phoneNumbers) {
      if (typeof phoneNumbers === "string") {
        phoneList = [phoneNumbers];
      }

      if (!Array.isArray(phoneList)) {
        return res.status(400).json({
          status: false,
          message: "Add one or more phone numbers, separated by commas",
          data: null,
        });
      }
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: "Please provide a valid email address",
          data: null,
        });
      }
    }

    const newInfo = await ContactInfo.create({
      address,
      email,
      openingHours,
      phoneNumbers: phoneList || [],
    });

    return res.status(201).json({
      status: true,
      message: "Contact info created successfully",
      data: newInfo,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while creating contact info",
      data: err.message,
    });
  }
};

// get all contact info
export const getAllContactInfos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await ContactInfo.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const items = await ContactInfo.find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    return res.status(200).json({
      status: true,
      message: "ContactInfos fetched successfully",
      data: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while fetching contact infos",
      data: err.message,
    });
  }
};

// get individual contact info
export const getContactInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const info = await ContactInfo.findById(id);

    if (!info) {
      return res.status(404).json({
        status: false,
        message: "Contact info not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Contact info fetched successfully",
      data: info,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while fetching contact info",
      data: err.message,
    });
  }
};

// update contact info
export const updateContactInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, email, openingHours, phoneNumbers } = req.body;

    if (!address && !email && !openingHours && !phoneNumbers) {
      return res.status(400).json({
        status: false,
        message: "At least one field must be provided for update",
        data: null,
      });
    }

    let phoneList = phoneNumbers;

    if (phoneNumbers) {
      if (typeof phoneNumbers === "string") {
        phoneList = [phoneNumbers];
      }

      if (!Array.isArray(phoneList)) {
        return res.status(400).json({
          status: false,
          message: "Add one or more phone numbers, separated by commas",
          data: null,
        });
      }
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: "Please provide a valid email address",
          data: null,
        });
      }
    }

    const updatedInfo = await ContactInfo.findByIdAndUpdate(
      id,
      {
        address,
        email,
        openingHours,
        phoneNumbers: phoneList,
      },
      { new: true }
    );

    if (!updatedInfo) {
      return res.status(404).json({
        status: false,
        message: "Contact info not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Contact info updated successfully",
      data: updatedInfo,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while updating contact info",
      data: err.message,
    });
  }
};

// delete contact info
export const deleteContactInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInfo = await ContactInfo.findByIdAndDelete(id);

    if (!deletedInfo) {
      return res.status(404).json({
        status: false,
        message: "Contact info not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Contact info deleted successfully",
      data: deletedInfo,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while deleting contact info",
      data: err.message,
    });
  }
};
