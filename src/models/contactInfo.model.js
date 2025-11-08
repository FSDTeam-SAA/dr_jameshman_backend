import mongoose from "mongoose";

const ContactInfoSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  openingHours: {
    type: String,
  },
  phoneNumbers: {
    type: [String],
    default: [],
  },
});

const ContactInfo = mongoose.model("ContactInfo", ContactInfoSchema);

export default ContactInfo;
