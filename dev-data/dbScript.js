import dotenv from "dotenv";

import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import Event from "../models/Event.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const json = JSON.parse(fs.readFileSync(`${__dirname}/events.json`));

dotenv.config();

const uri = process.env.DB_URI;
try {
  await mongoose.connect(uri);
  console.log("DB connection successful");
} catch (error) {
  console.log(error);
}

const user = await User.findOne({ email: "param@test.com" });
const events = json.map((event) => {
  return { ...event, organizer: user._id };
});

async function importData() {
  try {
    await Event.create(events);
    console.log("Import successful");
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

async function deleteData() {
  try {
    await Event.deleteMany();
    console.log("Delete successful");
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

if (process.argv[2] === "--import") {
  importData();
}

if (process.argv[2] === "--delete") {
  deleteData();
}
