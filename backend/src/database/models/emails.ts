import mongoose from "mongoose";

const emails = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required.']
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, 'Active status is required.']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const EmailsModel = mongoose.model('Emails', emails)