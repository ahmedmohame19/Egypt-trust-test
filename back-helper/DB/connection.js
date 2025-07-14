import mongoose from "mongoose";

export const conn = async () =>
  await mongoose
// local connection string 
    .connect("mongodb://127.0.0.1:27017/EgyptTrust")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Connected faild", err));
