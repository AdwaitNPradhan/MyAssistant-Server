import mongoose from "mongoose";

const DBConnector = async () => {
  try {
    console.log("Checking for ENV");
    if (process.env.DATABASE_URL) {
      console.log("ENV found, attempting mongoose connection");
      await mongoose.connect(process.env.DATABASE_URL);
      console.log("Mongoose is now connected");
    } else {
      console.log("ENV missing, Exitting App");
      process.exit(1);
    }
  } catch (e) {
    console.error("Can't Connect to Database. Exiting Start Up!");
    process.exit(1);
  }
};

export default DBConnector;
