import mongoose from "mongoose";

const uri = "mongodb://localhost:27017/test-mongodb";

async function connectDB() {
  try {
    await mongoose.connect(uri).then(() => console.info("MongoDB Connected!"));
  } catch (error) {
    console.error(error);
  }
}

export default connectDB;