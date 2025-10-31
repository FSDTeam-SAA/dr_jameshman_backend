import TreatmentList from "../models/treatmentList.model.js";
import TreatmentCategory from "../models/treatmentCategory.model.js";
import cloudinary from "cloudinary";

// create treatment list
export const createTreatmentList = async (req, res) => {
  try {
    const { categoryId, treatments } = req.body;

    const category = await TreatmentCategory.findById(categoryId);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    const parsedTreatments = JSON.parse(treatments);

    for (let item of parsedTreatments) {
      if (item.imageFile) {
        const upload = await cloudinary.uploader.upload(item.imageFile.path, {
          folder: "treatmentList",
        });
        item.image = upload.secure_url;
      }
    }

    const treatmentList = new TreatmentList({
      category: categoryId,
      treatments: parsedTreatments,
    });

    await treatmentList.save();
    res.status(201).json({ success: true, data: treatmentList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  get all treatment list
export const getTreatmentLists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const treatmentLists = await TreatmentList.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await TreatmentList.countDocuments();

    const totalPages = Math.ceil(totalCount / limit);

    // Respond with the treatment lists and pagination info
    return res.status(200).json({
      status: true,
      message: "Treatment lists fetched successfully",
      data: treatmentLists,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      staus: false,
      message: "Server error",
      error: err.message,
      data: nul,
    });
  }
};

// get an individual treatment list
export const getIndividualTreatment = async (req, res) => {
  try {
    const { listId, treatmentId } = req.params;

    const treatmentList = await TreatmentList.findById(listId);

    if (!treatmentList) {
      return res.status(404).json({
        status: false,
        message: "Treatment list not found",
        data: null,
      });
    }

    let treatment;
    if (treatmentId) {
      if (Number.isInteger(parseInt(treatmentId))) {
        const treatmentIndex = parseInt(treatmentId);
        treatment = treatmentList.treatments[treatmentIndex];

        if (!treatment) {
          return res.status(404).json({
            status: false,
            message: "Treatment not found at this index",
            data: null,
          });
        }
      } else {
        treatment = treatmentList.treatments.find(
          (t) => t.serviceName === treatmentId
        );
        if (!treatment) {
          return res.status(404).json({
            status: false,
            message: "Treatment with this serviceName not found",
            data: null,
          });
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "Treatment identifier is required" });
    }

    return res.status(200).json({
      status: true,
      message: "Treatment fetched successfully",
      data: treatment,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// edit treatment list
export const editTreatmentList = async (req, res) => {
  // try {
  //   const { listId } = req.params;
  //   console.log(listId)
  //   const { treatments } = req.body;
  //   console.log(treatments)

  //   if (!Array.isArray(treatments) || treatments.length === 0) {
  //     return res.status(400).json({
  //       status: false,
  //       message: "Treatments list is required",
  //       data: null,
  //     });
  //   }

  //   const treatmentList = await TreatmentList.findById(listId);
  //   if (!treatmentList) {
  //     return res.status(404).json({
  //       status: false,
  //       message: "Treatment list not found",
  //       data: null,
  //     });
  //   }

  //   treatmentList.treatments = treatments;

  //   await treatmentList.save();

  //   return res.status(200).json({
  //     status: true,
  //     message: "Treatment list updated successfully",
  //     data: treatmentList,
  //   });
  // } catch (err) {
  //   console.error(err);
  //   return res
  //     .status(500)
  //     .json({
  //       status: false,
  //       message: "Server error",
  //       data: err.message,
  //     });
  // }
  console.log("hello");
};
