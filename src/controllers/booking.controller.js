import mongoose from "mongoose";
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
          "Name, email, phone number, subject, preferred date and preferred time are required",
        data: null,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email address.",
        data: null,
      });
    }

    if (consent !== true) {
      return res.status(400).json({
        status: false,
        message: "You must give consent before booking",
        data: null,
      });
    }

    const dateObj = new Date(preferredDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        status: false,
        message: "Invalid preferred date format",
        data: null,
      });
    }

    const today = new Date();
    if (dateObj < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        status: false,
        message: "Preferred date cannot be in the past",
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
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: false,
        message: "Duplicate entry detected. Please check your submission",
        data: err.message,
      });
    }

    return res.status(500).json({
      status: false,
      message: "Server error while creating booking.",
      data: err.message,
    });
  }
};

// get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBookings = await Booking.countDocuments();
    const totalPages = Math.ceil(totalBookings / limit);

    const bookings = await Booking.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Bookings fetched successfully",
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while fetching bookings",
      data: err.message,
    });
  }
};

// get single booking
export const getSingleBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid booking ID",
        data: null,
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        status: false,
        message: "Booking not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (err) {
    console.error("Error fetching booking:", err);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching booking",
      data: err.message,
    });
  }
};

// delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid booking ID format",
        data: null,
      });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({
        status: false,
        message: "Booking not found or already deleted",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Booking deleted successfully",
      data: deletedBooking,
    });
  } catch (err) {
    console.error("Error deleting booking:", err);
    return res.status(500).json({
      status: false,
      message: "Server error while deleting booking",
      data: err.message,
    });
  }
};
