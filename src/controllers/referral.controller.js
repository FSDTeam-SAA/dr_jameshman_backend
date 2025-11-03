import fs from "fs";
import mongoose from "mongoose";
import Referral from "../models/referral.model.js";
import cloudinary from "../utils/cloudinary.js";

// create referral
export const createReferral = async (req, res) => {
  try {
    const {
      patientName,
      patientDOB,
      patientPhone,
      patientEmail,
      dentistName,
      dentistPractice,
      dentistPhone,
      dentistEmail,
      additionalNotes,
      consentGiven,
    } = req.body;

    if (
      !patientName ||
      !patientDOB ||
      !patientPhone ||
      !patientEmail ||
      !dentistName ||
      !dentistPractice ||
      !dentistPhone ||
      !dentistEmail ||
      consentGiven !== "true"
    ) {
      return res.status(400).json({
        status: false,
        message: "All required fields must be filled and consent must be given",
        data: null,
      });
    }

    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "referrals",
        });

        uploadedFiles.push({
          public_id: uploadResult.public_id,
          fileUrl: uploadResult.secure_url,
        });

        fs.unlinkSync(file.path);
      }
    }

    const referral = new Referral({
      patient: {
        name: patientName,
        dateOfBirth: patientDOB,
        phoneNumber: patientPhone,
        email: patientEmail,
      },
      dentist: {
        name: dentistName,
        practice: dentistPractice,
        phoneNumber: dentistPhone,
        email: dentistEmail,
      },
      additionalNotes,
      uploadedFiles,
      consentGiven: consentGiven === "true",
    });

    await referral.save();

    return res.status(201).json({
      status: true,
      message: "Referral successfully created",
      data: referral,
    });
  } catch (err) {
    console.error("Referral creation error:", err);
    return res.status(500).json({
      status: false,
      message: "Server error while creating referral",
      data: null,
    });
  }
};

// get a single referral
export const getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({
        status: false,
        message: "Booking not found or already deleted",
        data: null,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Referral found",
      data: referral,
    });
  } catch (err) {
    return res.status(404).json({
      status: false,
      message: "Booking not found or already deleted",
      data: null,
    });
  }
};

// get all referrals
export const getAllReferral = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalReferrals = await Referral.countDocuments();
    const totalPages = Math.ceil(totalReferrals / limit);

    const referral = await Referral.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Referral fetched successfully",
      data: referral,
      pagination: {
        currentPage: page,
        totalPages,
        totalReferrals,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

// delete referral
export const deleteReferral = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid referral ID format",
        data: null,
      });
    }

    const deletedReferral = await Referral.findByIdAndDelete(id);
    if (!deletedReferral) {
      return res.status(404).json({
        status: false,
        message: "Referral not found or already deleted",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Referral deleted successfully",
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while deleting referral",
      data: err.message,
    });
  }
};
