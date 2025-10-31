import mongoose from "mongoose";

const { Schema, model } = mongoose;

const treatmentFeeSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Service Name is required"],
      trim: true,
    },
    items: [
      {
        description: {
          type: String,
          required: [true, "Description is required"],
          trim: true,
        },
        rate: {
          type: Number,
          required: [true, "Rate is required"],
          min: [0, "Rate cannot be negative"],
        },
      },
    ],
    currency: {
      type: String,
      default: "EUR",
    },
  },
  { timestamps: true }
);

const TreatmentFee = model("TreatmentFee", treatmentFeeSchema);
export default TreatmentFee;
