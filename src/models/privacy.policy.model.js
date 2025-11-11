import mongoose from "mongoose";

const { Schema, model } = mongoose;

const privacyPolicySchema = new Schema(
  {
    policyContent: {
      type: String,
      required: [true, "Policy content is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const PrivacyPolicy = model("PrivacyPolicy", privacyPolicySchema);

export default PrivacyPolicy;
