import fs from "fs";
import cloudinary from "cloudinary";
import TreatmentCategory from "../models/treatmentCategory.model.js";

// create treatment category
export const createTreatmentCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: false,
        message: "treatment category name is required",
        data: null,
      });
    }

    const existingCategory = await TreatmentCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: false,
        message: "Treatment category already exists",
        data: null,
      });
    }

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "treatmentCategories",
      });
      imageUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path);
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Image is required", data: null });
    }

    const category = new TreatmentCategory({
      name: name.trim(),
      image: imageUrl,
    });

    await category.save();

    return res.status(201).json({
      status: true,
      message: "Created treatment category successfully",
      data: category,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCategories = await TreatmentCategory.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    const categories = await TreatmentCategory.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      mnessage: "Fetach all treatment categories successfully",
      data: categories,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCategories: totalCategories,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: error.message });
  }
};

// get single category
export const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await TreatmentCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "treatment category not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Treatment category fetched successfully",
      data: category,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: error.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let imageUrl = req.body.image;

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "treatmentCategories",
      });
      imageUrl = upload.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updated = await TreatmentCategory.findByIdAndUpdate(
      id,
      { name: req.body.name, image: imageUrl },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({
          status: false,
          message: "Treatment category not found",
          data: null,
        });

    return res.status(200).json({
      status: true,
      message: "Treatment category updated successfully",
      data: updated,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TreatmentCategory.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({
        status: false,
        message: "Treatment category not found",
        data: null,
      });

    return res.status(200).json({
      status: true,
      message: "Treatment category deleted",
      data: null,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server error", data: error.message });
  }
};
