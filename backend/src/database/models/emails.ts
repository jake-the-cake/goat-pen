import mongoose from "mongoose";

const emails = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required.']
  }
})

export const EmailsModel = mongoose.model('Emails', emails)