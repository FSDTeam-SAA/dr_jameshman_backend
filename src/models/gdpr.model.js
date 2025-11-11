import mongoose from "mongoose";

const { Schema, model } = mongoose;

const gdprSchema = new Schema(
  {
    gdprContent: {
      type: String,
      required: [true, "GDPR content is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const GDPR = model("GDPR", gdprSchema);
export default GDPR;
