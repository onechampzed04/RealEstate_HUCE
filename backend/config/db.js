import mongoose from "mongoose";

const connecttionString =
  "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || connecttionString,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
