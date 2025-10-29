import mongoose from "mongoose";

const { Schema, model } = mongoose;

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      unique: true, 
      trim: true, 
    },
    answer: {
      type: String,
      required: true, 
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true } 
);

const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;