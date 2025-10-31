import fs from "fs";
import TreatmentCategory from "../models/treatmentCategory.model.js"
import TreatmentList from "../models/treatmentList.model.js";
import cloudinary from '../utils/cloudinary.js'

// create treatment list
export const createTreatmentList = async (req, res) => {
  try {
    const { title, serviceName, description, category } = req.body;

    // Validate required fields
    if (!title || !serviceName || !description || !category) {
      return res.status(400).json({
        status: false,
        message: "All fields (title, serviceName, description, category) are required",
        data: null,
      });
    }

    // Check if image file is uploaded
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Image file is required",
        data: null,
      });
    }

    // Verify category exists (optional but recommended)
    const categoryExists = await TreatmentCategory.findById(category);
    if (!categoryExists) {
      fs.unlinkSync(req.file.path); // delete uploaded file if invalid
      return res.status(404).json({
        status: false,
        message: "Category not found",
        data: null,
      });
    }

    const localFilePath = req.file.path;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "treatments",
    });

    // Delete image from local server after upload
    fs.unlinkSync(localFilePath);

    // Save to DB
    const treatment = await TreatmentList.create({
      title,
      serviceName,
      description,
      image: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      category,
    });

    return res.status(201).json({
      status: true,
      message: "Treatment created successfully",
      data: treatment,
    });
  } catch (error) {
    console.error("Error creating treatment:", error);

    // Cleanup uploaded file if something fails before unlink
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// get all treatment list
export const getAllTreatmentList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalTreatments = await TreatmentList.countDocuments();
    const totalPages = Math.ceil(totalTreatments / limit);

    const treatments = await TreatmentList.find()
      .populate("category", "name image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Treatments fetched successfully",
      data: treatments,
      pagination: {
        currentPage: page,
        totalPages,
        totalTreatments,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while fetching treatments",
      data: err.message,
    });
  }
};

// get single treatment list
export const getSingleTreatmentList = async (req, res) => {
  try {
    const { id } = req.params;
    const treatment = await TreatmentList.findById(id).populate("category", "name image");

    if (!treatment) {
      return res.status(404).json({
        status: false,
        message: "Treatment not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Treatment fetched successfully",
      data: treatment,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while fetching treatment",
      data: err.message,
    });
  }
};

// update treatment list
export const updateTreatmentList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, serviceName, description, category } = req.body;

    const treatment = await TreatmentList.findById(id);
    if (!treatment) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: false,
        message: "Treatment not found",
        data: null,
      });
    }

    let imageUrl = treatment.image;
    let cloudinaryId = treatment.cloudinaryId;

    if (req.file) {
      await cloudinary.uploader.destroy(treatment.cloudinaryId);
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "treatments",
      });
      fs.unlinkSync(req.file.path);
      imageUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;
    }

    treatment.title = title || treatment.title;
    treatment.serviceName = serviceName || treatment.serviceName;
    treatment.description = description || treatment.description;
    treatment.category = category || treatment.category;
    treatment.image = imageUrl;
    treatment.cloudinaryId = cloudinaryId;

    await treatment.save();

    return res.status(200).json({
      status: true,
      message: "Treatment updated successfully",
      data: treatment,
    });
  } catch (err) {
    console.error("Error updating treatment:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: false,
      message: "Server error while updating treatment",
      data: err.message,
    });
  }
};

// delete treatment list
export const deleteTreatmentList = async (req, res) => {
  try {
    const { id } = req.params;
    const treatment = await TreatmentList.findById(id);

    if (!treatment) {
      return res.status(404).json({
        status: false,
        message: "Treatment not found",
        data: null,
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(treatment.cloudinaryId);

    // Delete from DB
    await TreatmentList.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: "Treatment deleted successfully",
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error while deleting treatment",
      data: err.message,
    });
  }
};