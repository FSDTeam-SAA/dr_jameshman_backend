import GDPR from "../models/gdpr.model.js";

// create gdpr
export const createGDPR = async (req, res) => {
  try {
    const { gdprContent } = req.body;

    const existing = await GDPR.findOne();
    if (existing) {
      return res.status(400).json({
        status: false,
        message: "GDPR already exists. You can only update it.",
        data: null,
      });
    }

    const created = await GDPR.create({ gdprContent });

    return res.status(201).json({
      status: true,
      message: "GDPR created successfully",
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

// edit gdpr
export const editGDPR = async (req, res) => {
  try {
    const { gdprContent } = req.body;

    const gdpr = await GDPR.findOne();
    if (!gdpr) {
      return res.status(404).json({
        status: false,
        message: "GDPR not found. Create it first.",
        data: null,
      });
    }

    const updated = await GDPR.findByIdAndUpdate(
      gdpr._id,
      { gdprContent },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "GDPR updated successfully",
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

// get gdpr
export const getGDPR = async (_, res) => {
  try {
    const existing = await GDPR.findOne();

    return res.status(200).json({
      status: true,
      message: "Fetch GDPR data successfully",
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
