import mongoose from "mongoose";
import { quiggleSchema } from "./utils";

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
    },
    ...quiggleSchema
  },
  {
    versionKey: false
  }
)

export const EmailsModel = mongoose.model('Emails', emails)

// const x = new EmailsModel({
//   email: 'email@address.com',
//   c_dec: () => console.log('ok'),
//   t_added: new Date().getTime()
// })

// console.log(x)
// x.save()
// EmailsModel.find().then(function(x: any) {
//   console.log(x)
//   const c = x.filter((z: any) => z.c_dec)
//   console.log(c)
// })