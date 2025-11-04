import TreatmentFee from "../models/treatmentFee.model.js";

//  create treatment fee
export const createTreatmentFee = async (req, res) => {
  try {
    const { serviceName, items, currency } = req.body;

    if (!serviceName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Service name and at least one item are required",
        data: null,
      });
    }

    for (const item of items) {
      if (!item.description || item.rate === undefined) {
        return res.status(400).json({
          status: false,
          message: "Each item must include a description and rate",
          data: null,
        });
      }
    }

    const treatmentFee = await TreatmentFee.create({
      serviceName,
      items,
      currency,
    });

    return res.status(201).json({
      status: true,
      message: "Treatment fee created successfully",
      data: treatmentFee,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error while creating treatment fee",
      data: error.message,
    });
  }
};

// get all treatment fees
export const getAllTreatmentFees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalFees = await TreatmentFee.countDocuments();
    const totalPages = Math.ceil(totalFees / limit);

    const fees = await TreatmentFee.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Treatment fees fetched successfully",
      data: fees,
      pagination: {
        currentPage: page,
        totalPages,
        totalFees,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error while fetching treatment fees",
      data: error.message,
    });
  }
};

// get a single treatment fee
export const getTreatmentFeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await TreatmentFee.findById(id);

    if (!fee) {
      return res.status(404).json({
        status: false,
        message: "Treatment fee not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Treatment fee fetched successfully",
      data: fee,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error while fetching treatment fee",
      data: error.message,
    });
  }
};

// edit treatment fee
export const updateTreatmentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, items, currency } = req.body;

    const fee = await TreatmentFee.findById(id);
    if (!fee) {
      return res.status(404).json({
        status: false,
        message: "Treatment fee not found",
        data: null,
      });
    }

    if (serviceName) fee.serviceName = serviceName;
    if (currency) fee.currency = currency;
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        if (!item.description || item.rate === undefined) {
          return res.status(400).json({
            status: false,
            message: "Each item must include a description and rate",
            data: null,
          });
        }
      }
      fee.items = items;
    }

    await fee.save();

    return res.status(200).json({
      status: true,
      message: "Treatment fee updated successfully",
      data: fee,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error while updating treatment fee",
      data: error.message,
    });
  }
};

// delete treatment fee
export const deleteTreatmentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await TreatmentFee.findById(id);

    if (!fee) {
      return res.status(404).json({
        status: false,
        message: "Treatment fee not found",
        data: null,
      });
    }

    await TreatmentFee.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      message: "Treatment fee deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error while deleting treatment fee",
      data: error.message,
    });
  }
};
