import TermsOfService from "../models/terms.service.model.js";

// create terms of service
export const createTermsOfService = async (req, res) => {
  try {
    const { termsContent } = req.body;

    const existing = await TermsOfService.findOne();
    if (existing) {
      return res.status(400).json({
        status: false,
        message: "Terms of Service already exists. You can only update it.",
        data: null,
      });
    }

    const created = await TermsOfService.create({ termsContent });

    return res.status(201).json({
      status: true,
      message: "Terms of Service created successfully",
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

// edit terms of service
export const editTermsOfService = async (req, res) => {
  try {
    const { termsContent } = req.body;

    const terms = await TermsOfService.findOne();
    if (!terms) {
      return res.status(404).json({
        status: false,
        message: "Terms of Service not found. Create it first.",
        data: null,
      });
    }

    const updated = await TermsOfService.findByIdAndUpdate(
      terms._id,
      { termsContent },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Terms of Service updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};

// get terms of service
export const getTermsOfService = async (_, res) => {
  try {
    const existing = await TermsOfService.findOne();

    return res.status(200).json({
      status: true,
      message: "Fetch terms of service data successfully",
      data: existing,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};
