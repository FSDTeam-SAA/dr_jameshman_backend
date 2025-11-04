import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    before: {
      imageName: {
        type: String,
        required: [true, "Image for before section is required"],
        trim: true,
      },
      cloudinaryId: {
        type: String,
      },
    },
    after: {
      imageName: {
        type: String,
        required: [true, "Image for after section is required"],
        trim: true,
      },
      cloudinaryId: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
