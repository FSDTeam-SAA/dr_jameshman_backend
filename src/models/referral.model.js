// models/Referral.js
import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    patient: {
      name: {
        type: String,
        required: [true, "Patient name is required"],
        trim: true,
      },
      dateOfBirth: {
        type: Date,
        required: [true, "Patient date of birth is required"],
      },
      phoneNumber: {
        type: String,
        required: [true, "Patient phone number is required"],
      },
      email: {
        type: String,
        required: [true, "Patient email is required"],
        match: [/\S+@\S+\.\S+/, "Invalid email address"],
        lowercase: true,
        trim: true,
      },
    },
    dentist: {
      name: {
        type: String,
        required: [true, "Dentist name is required"],
        trim: true,
      },
      practice: {
        type: String,
        required: [true, "Dentist practice name is required"],
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: [true, "Dentist phone number is required"],
      },
      email: {
        type: String,
        required: [true, "Dentist email is required"],
        match: [/\S+@\S+\.\S+/, "Invalid email address"],
        lowercase: true,
        trim: true,
      },
    },
    additionalNotes: {
      type: String,
      trim: true,
      default: "",
    },
    uploadedFiles: [
      {
        public_id: { type: String },
        fileUrl: { type: String },
      },
    ],
    consentGiven: {
      type: Boolean,
      required: [true, "Consent must be given before submission"],
    },
  },
  { timestamps: true }
);

const Referral = mongoose.model("Referral", referralSchema);
export default Referral;
