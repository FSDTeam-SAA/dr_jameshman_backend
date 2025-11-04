import fs from "fs";
import Doctor from "../models/doctor.model.js";
import cloudinary from "../utils/cloudinary.js";

// create doctor
export const createDoctor = async (req, res) => {
  try {
    const { name, title, description } = req.body;

    if (!name || !title || !description) {
      return res.status(400).json({
        status: false,
        message: "Name, title and description are required",
        data: null,
      });
    }

    let imageUrl = null;
    let cloudinaryId = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "doctors",
      });

      imageUrl = result.secure_url;
      cloudinaryId = result.public_id;

      fs.unlinkSync(req.file.path);
    }

    const doctor = await Doctor.create({
      name,
      title,
      description,
      image: imageUrl,
      cloudinaryId: cloudinaryId,
    });

    return res.status(201).json({
      status: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

// update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description } = req.body;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
        data: null,
      });
    }

    if (req.file) {
      if (doctor.cloudinaryId) {
        await cloudinary.uploader.destroy(doctor.cloudinaryId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "doctors",
      });

      doctor.image = result.secure_url;
      doctor.cloudinaryId = result.public_id;

      fs.unlinkSync(req.file.path);
    }

    doctor.name = name || doctor.name;
    doctor.title = title || doctor.title;
    doctor.description = description || doctor.description;

    await doctor.save();

    return res.status(200).json({
      status: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

// get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalDoctors = await Doctor.countDocuments();
    const totalPages = Math.ceil(totalDoctors / limit);

    const doctors = await Doctor.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Doctors fetched successfully",
      data: doctors,
      pagination: {
        currentPage: page,
        totalPages,
        totalDoctors,
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

// get doctor by id
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Doctor fetched successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

// delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
        data: null,
      });
    }

    if (doctor.cloudinaryId) {
      await cloudinary.uploader.destroy(doctor.cloudinaryId);
    }

    await doctor.deleteOne();

    return res.status(200).json({
      status: true,
      message: "Doctor deleted successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};
