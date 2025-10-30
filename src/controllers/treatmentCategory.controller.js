import TreatmentCategory from "../models/treatmentCategory.model.js";

// create treatment category
export const createTreatmentCategory = async (req, res) => {
  try {
    const { treatmentCategory } = req.body;
    if (!treatmentCategory) {
      return res.status(400).json({
        status: false,
        message: "Treatment category is required",
        data: null,
      });
    }

    const treatmentCategoryFound = await TreatmentCategory.findOne({
      treatmentCategory,
    });
    if (treatmentCategoryFound) {
      return res.status(400).json({
        status: false,
        message: "Treatment category name already exist",
        data: null,
      });
    }

    const newTreatmentCategory = await TreatmentCategory.create({
      treatmentCategory,
    });

    return res.status(201).json({
      status: true,
      message: "Treatment category is created successfully",
      data: newTreatmentCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      data: error.message,
    });
  }
};
