import fs from "fs";
import Gallery from "../models/gallery.model.js";
import cloudinary from "../utils/cloudinary.js";

// create gallery
export const createGallery = async (req, res) => {
  try {
    const { imageName, imageDescription } = req.body;

    if (!imageName || !imageDescription) {
      return res.status(400).json({
        status: false,
        message: "Image name and title are required",
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

    const localFilePath = req.file.path;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "gallery",
    });

    fs.unlinkSync(localFilePath);

    const gallery = await Gallery.create({
      imageName,
      imageDescription,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
    });

    return res.status(201).json({
      status: true,
      message: "Gallery item created successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Error creating gallery:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// get all galleries
export const getAllGalleries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const galleries = await Gallery.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Gallery.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      status: true,
      message: "Galleries fetched successfully",
      data: galleries,
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
      message: "Server error",
      data: err.message,
    });
  }
};

// get single gallery
export const getSingleGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        status: false,
        message: "Gallery not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Gallery fetched successfully",
      data: gallery,
    });
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      data: err.message,
    });
  }
};

// delete gallery
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        status: false,
        message: "Gallery not found",
      });
    }

    await cloudinary.uploader.destroy(gallery.cloudinaryId);

    await Gallery.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: "Gallery deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("Error deleting gallery:", err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      data: err.message,
    });
  }
};

// update gallery
// export const updateGallery = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { imageName, imageDescription } = req.body;

//     const gallery = await Gallery.findById(id);
//     console.log(gallery);
//     if (!gallery) {
//       if (req.file && fs.existsSync(req.file.path))
//         fs.unlinkSync(req.file.path);
//       return res.status(404).json({
//         status: false,
//         message: "Gallery not found",
//         data: null,
//       });
//     }

//     const updateFields = {};
//     if (imageName) updateFields.imageName = imageName;
//     if (imageDescription) updateFields.imageDescription = imageDescription;

//     if (req.file) {
//       const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//         folder: "gallery",
//         resource_type: "image",
//       });

//       fs.unlinkSync(req.file.path);

//       if (gallery.cloudinaryId) {
//         await cloudinary.uploader.destroy(gallery.cloudinaryId);
//       }

//       updateFields.imageUrl = uploadResult.secure_url;
//       updateFields.cloudinaryId = uploadResult.public_id;
//     }

//     const updatedGallery = await Gallery.findByIdAndUpdate(id, updateFields, {
//       new: true,
//       runValidators: true,
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Gallery updated successfully",
//       data: updatedGallery,
//     });
//   } catch (error) {
//     if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     return res.status(500).json({
//       status: false,
//       message: "Error updating gallery",
//       data: error.message,
//     });
//   }
// };

export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const imageName = req.body?.imageName || null;
    const imageDescription = req.body?.imageDescription || null;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      if (req.file && fs.existsSync(req.file.path))
        fs.unlinkSync(req.file.path);
      return res.status(404).json({
        status: false,
        message: "Gallery not found",
        data: null,
      });
    }

    const updateFields = {};

    if (imageName) updateFields.imageName = imageName;
    if (imageDescription) updateFields.imageDescription = imageDescription;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "gallery",
        resource_type: "image",
      });

      fs.unlinkSync(req.file.path);

      if (gallery.cloudinaryId) {
        await cloudinary.uploader.destroy(gallery.cloudinaryId);
      }

      updateFields.imageUrl = uploadResult.secure_url;
      updateFields.cloudinaryId = uploadResult.public_id;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: true,
      message: "Gallery updated successfully",
      data: updatedGallery,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({
      status: false,
      message: "Error updating gallery",
      data: error.message,
    });
  }
};
