import mongoose from "mongoose";

const connecttionString =
  "mongodb+srv://nguyenvankien2004hanam_db_user:wAjtuwQqWAvIehKe@cluster0.mi9djbl.mongodb.net/?appName=Cluster0";

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
