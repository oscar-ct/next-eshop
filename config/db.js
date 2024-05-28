import mongoose from "mongoose";


let connected = false;

const connectDB = async () => {
    mongoose.set("strictQuery", true);
    // check db connection
    if (connected) {
        console.log("db already connected...");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        connected = true;
        console.log("db connected..");
    } catch (e) {
        console.log(e);
    }
};

export default connectDB;