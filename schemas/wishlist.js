import { Schema } from "mongoose";

export const wishlistSchema = new Schema({
  product_id: String,
  product_name: String,
  unit_price: String,
  categories: [
    {
      type: String
    }
  ]
})