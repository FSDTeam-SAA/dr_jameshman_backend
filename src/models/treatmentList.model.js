// import mongoose from 'mongoose';

// const { Schema, model } = mongoose;

// const treatmentItemSchema = new Schema({
//   serviceName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   image: {
//     type: String,
//     default: ''
//   }
// });

// const treatmentListSchema = new Schema({
//   treatments: [treatmentItemSchema],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default model('TreatmentList', treatmentListSchema);

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const treatmentItemSchema = new Schema({
  serviceName: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  image: { type: String, default: "" },
});

const treatmentListSchema = new Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TreatmentCategory",
      required: true,
    },
    treatments: [treatmentItemSchema],
  },
  { timestamps: true }
);

export default model("TreatmentList", treatmentListSchema);
