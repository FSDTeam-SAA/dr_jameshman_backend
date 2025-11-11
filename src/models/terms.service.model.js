import mongoose from "mongoose";

const { Schema, model } = mongoose;

const termsOfServiceSchema = new Schema(
  {
    termsContent: {
      type: String,
      required: [true, "Terms content is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const TermsOfService = model("TermsOfService", termsOfServiceSchema);

export default TermsOfService;
