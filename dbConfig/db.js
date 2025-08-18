import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB = process.env.DB_URI;
mongoose
  .connect(DB)
  .then(() => console.log("Connection to DB successful"))
  .catch(() => console.log("DB connection unsuccessful"));
