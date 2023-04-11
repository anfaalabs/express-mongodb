import { model } from 'mongoose';
import { userSchema, wishlistSchema } from './schemas/index.js';

export const Users = model("user", userSchema);
export const Wishlists = model("wishlist", wishlistSchema);