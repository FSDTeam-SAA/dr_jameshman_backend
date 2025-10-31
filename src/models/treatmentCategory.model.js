import mongoose from "mongoose";

const { Schema, model } = mongoose;

const treatmentCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Treatment catyegory anme is required"],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Treatment category image is required"],
    },
  },
  { timestamps: true }
);

export default model("TreatmentCategory", treatmentCategorySchema);
