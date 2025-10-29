import TreatmentFee from "../models/treatmentFee.model.js";

//  create treatment fee
export const createTreatmentFee = async (req, res) => {
  try {
    const { serviceName, description, rate, currency } = req.body;

    if (!serviceName || !description || rate == null) {
      return res.status(400).json({
        status: false,
        message: "Service name, description and rate are required",
        data: null,
      });
    }

    const existingFee = await TreatmentFee.findOne({
      serviceName: { $regex: `^${serviceName}$`, $options: "i" },
    });

    if (existingFee) {
      return res.status(409).json({
        status: false,
        message: "A treatment fee with this service name already exists",
        data: null,
      });
    }

    const treatmentFee = await TreatmentFee.create({
      serviceName,
      description,
      rate,
      currency,
    });

    return res.status(201).json({
      status: true,
      message: "Treatment fee created successfully",
      data: treatmentFee,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Server error while creating treatment fee",
      data: null,
    });
  }
};

// get all treatment fees
export const getAllTreatmentFees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const treatmentFees = await TreatmentFee.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalFees = await TreatmentFee.countDocuments();
    const totalPages = Math.ceil(totalFees / limit);

    return res.status(200).json({
      status: true,
      message: "Treatment fees fetched successfully",
      data: treatmentFees,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalFees,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
      data: null,
    });
  }
};

// get a single treatment fee
export const getTreatmentFeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const treatmentFee = await TreatmentFee.findById(id);

    if (!treatmentFee) {
      return res.status(404).json({
        status: false,
        message: "Treatment fee not found",
        data: null
      });
    }

    return res.status(200).json({
      status: true,
      message: "Treatment fee fetch successfully",
      data: treatmentFee,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Server error while fetching treatment fee",
      data: null,
    });
  }
};

// edit treatment fee
export const updateTreatmentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, description, rate, currency } = req.body;

    const treatmentFee = await TreatmentFee.findById(id);
    if (!treatmentFee) {
      return res.status(404).json({
        status: false,
        message: "Treatment fee not found",
        data: null,
      });
    }

    if (
      serviceName &&
      serviceName.toLowerCase() !== treatmentFee.serviceName.toLowerCase()
    ) {
      const duplicate = await TreatmentFee.findOne({
        serviceName: { $regex: `^${serviceName}$`, $options: "i" },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "A treatment fee with this service name already exists",
        });
      }
    }

    treatmentFee.serviceName = serviceName ?? treatmentFee.serviceName;
    treatmentFee.description = description ?? treatmentFee.description;
    treatmentFee.rate = rate ?? treatmentFee.rate;
    treatmentFee.currency = currency ?? treatmentFee.currency;

    const updatedFee = await treatmentFee.save();

    res.status(200).json({
      status: true,
      message: "Treatment fee updated successfully",
      data: updatedFee,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Server error while updating treatment fee",
      data: null,
    });
  }
};

// delete treatment fee
export const deleteTreatmentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const treatmentFee = await TreatmentFee.findById(id);

    if (!treatmentFee) {
      return res.status(404).json({
        status: false,
        message: "Treatment fee not found",
        data: null,
      });
    }

    await treatmentFee.deleteOne();

    return res.status(200).json({
      status: true,
      message: "Treatment fee deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Server error while deleting treatment fee",
      data: null,
    });
  }
};
