import fs from "fs";
import TreatmentCategory from "../models/treatmentCategory.model.js"
import TreatmentList from "../models/treatmentList.model.js";
import cloudinary from '../utils/cloudinary.js'

// create treatment list
export const createTreatmentList = async (req, res) => {
  try {
    const { title, serviceName, description, category } = req.body;

    if (!title || !serviceName || !description || !category) {
      return res.status(400).json({
        status: false,
        message: "All fields (title, serviceName, description, category) are required",
        data: null,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Image file is required",
        data: null,
      });
    }

    const categoryExists = await TreatmentCategory.findById(category);
    if (!categoryExists) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: false,
        message: "Category not found",
        data: null,
      });
    }

    const localFilePath = req.file.path;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "treatments",
    });

    fs.unlinkSync(localFilePath);

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

    await cloudinary.uploader.destroy(treatment.cloudinaryId);

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

//  get treatment list by category Id
// export const getTreatmentListByCategory = async (req, res) => {
//  try {
//     const { categoryId } = req.params;

//     const category = await TreatmentCategory.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({
//         status: false,
//         message: "Category not found",
//         data: null,
//       });
//     }

//     const treatments = await TreatmentList.find({ category: categoryId }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       status: true,
//       message: "Treatments fetched successfully for this category",
//       data: {
//         category,
//         treatments,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching treatments by category:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server error while fetching treatments",
//       data: error.message,
//     });
//   }
// };

export const getTreatmentListByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // 1️⃣ Check if category exists
    const category = await TreatmentCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Treatment category not found",
        data: null,
      });
    }

    // 2️⃣ Find all treatments associated with this category
    const treatments = await TreatmentList.find({ category: categoryId })
      .populate("category", "name image") // optional: include category info
      .sort({ createdAt: -1 });

    // 3️⃣ Return response
    return res.status(200).json({
      status: true,
      message: "Treatments fetched successfully for this category",
      data: {
        category,
        treatments,
      },
    });
  } catch (error) {
    console.error("Error fetching treatments by category:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching treatments by category",
      data: error.message,
    });
  }
};