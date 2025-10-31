import mongoose from "mongoose";

const { Schema, model } = mongoose;

const treatmentSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Treatment title is required"],
      trim: true,
    },
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    cloudinaryId: {
      type: String,
      required: [true, "Cloudinary ID is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TreatmentCategory",
      required: [true, "Category reference is required"],
    },
  },
  { timestamps: true }
);

export default model("TreatmentList", treatmentSchema);
