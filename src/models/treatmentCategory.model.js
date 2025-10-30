import mongoose from "mongoose";

const treatmentCategorySchema = new mongoose.Schema(
  {
    treatmentCategory: {
      type: String,
      required: [true, "Treatment category name is required"],
      unique: true,
      trim: true,
    },
    treatmentList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TreatmentList",
    },
  },
  { timestamps: true }
);

const TreatmentCategory =
  mongoose.models.TreatmentCategory ||
  mongoose.model("TreatmentCategory", treatmentCategorySchema);

export default TreatmentCategory;
