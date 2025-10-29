import Booking from "../models/booking.model.js";

// create booking
export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      subject,
      preferredDate,
      preferredTime,
      message,
      consent,
    } = req.body;

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !subject ||
      !preferredDate ||
      !preferredTime
    ) {
      return res.status(400).json({
        status: false,
        message:
          'Name, email, phone number, subject, preferred date and preferred time are required',
        data: null,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: 'Please provide a valid email address.',
        data: null,
      });
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        status: false,
        message: 'Please provide a valid phone number',
        data: null,
      });
    }

    if (consent !== true) {
      return res.status(400).json({
        status: false,
        message: 'You must give consent before booking',
        data: null,
      });
    }

    const dateObj = new Date(preferredDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        status: false,
        message: 'Invalid preferred date format',
        data: null,
      });
    }

    const today = new Date();
    if (dateObj < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        status: false,
        message: 'Preferred date cannot be in the past',
        data: null,
      });
    }

    const newBooking = await Booking.create({
      name,
      email,
      phoneNumber,
      subject,
      preferredDate: dateObj,
      preferredTime,
      message,
      consent,
    });

    return res.status(201).json({
      status: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (err) {
    console.error('Error creating booking:', err);

    if (err.code === 11000) {
      return res.status(409).json({
        status: false,
        message: 'Duplicate entry detected. Please check your submission',
        error: err.message,
        data: null,
      });
    }

    return res.status(500).json({
      status: false,
      message: 'Server error while creating booking.',
      data: err.message,
    });
  }
};