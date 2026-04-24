import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  verifiedPersonName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    trim: true,
  },
  bloodRequestType: {
    type: String,
    required: true,
    trim: true,
  },
  hospitalAddressWithPincode: {
    type: String,
    required: true,
    trim: true,
  },
  locationAddress: {
    type: String,
    required: true,
    trim: true,
  },
  requestImageUrl: {
    type: String,
    default: "",
    trim: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

export default BloodRequest;

