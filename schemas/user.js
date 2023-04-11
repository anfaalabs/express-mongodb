import { Schema, Types } from "mongoose";

export const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 25,
  },
  name: {
    type: String,
    required: true,
  },
  wishlist: [
    {
      type: Types.ObjectId,
      ref: 'wishlist'
    }
  ]
});