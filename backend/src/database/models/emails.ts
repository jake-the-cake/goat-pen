import mongoose from "mongoose";
import { quiggleSchema } from "./utils";

const emails = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required.']
    },
    isActive: {
      type: String,
      default: 'true',
      required: [true, 'Active status is required.']
    },
    ...quiggleSchema
  },
  {
    versionKey: false
  }
)

export const EmailsModel = mongoose.model('Emails', emails)