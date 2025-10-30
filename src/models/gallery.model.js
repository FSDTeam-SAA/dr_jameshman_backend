import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    imageName: {
      type: String,
      required: [true, "Image name is required"],
      trim: true,
    },
    imageDescription: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    cloudinaryId: {
      type: String,
      required: [true, "Cloudinary ID is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
