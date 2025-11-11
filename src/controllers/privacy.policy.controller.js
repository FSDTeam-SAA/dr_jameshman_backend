import PrivacyPolicy from "../models/privacy.policy.model.js";

// create privacy policy
export const createPrivacyPolicy = async (req, res) => {
  try {
    const { policyContent } = req.body;

    const existing = await PrivacyPolicy.findOne();
    if (existing) {
      return res.status(400).json({
        status: false,
        message: "Privacy policy already exists. You can only update it.",
      });
    }

    const created = await PrivacyPolicy.create({ policyContent });

    return res.status(201).json({
      status: true,
      message: "Privacy policy created successfully",
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

// edit privacy policy
export const editPrivacyPolicy = async (req, res) => {
  try {
    const { policyContent } = req.body;

    const policy = await PrivacyPolicy.findOne();
    if (!policy) {
      return res.status(404).json({
        status: false,
        message: "Privacy policy not found. Create it first.",
      });
    }

    const updated = await PrivacyPolicy.findByIdAndUpdate(
      policy._id,
      { policyContent },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Privacy policy updated successfully",
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

// get privacy policy
export const getPrivacyPolicy = async (_, res) => {
  try {
    const existing = await PrivacyPolicy.findOne();

    return res.status(200).json({
      status: true,
      message: "Fetch privacy policy data successfully",
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
