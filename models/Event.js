import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [3, "Title must be atleast 3 characters"],
      maxlength: [255, "Title must be atmost 255 characters"],
      required: [true, "Please provide a title"],
    },
    description: {
      type: String,
      maxlength: [5000, "Title must be atmost 255 characters"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a Date for the event"],
    },
    location: {
      type: String,
      required: [true, "Please provide a Date for the event"],
      maxlength: [255, "Location must be at most 255 characters"],
    },
    city: {
      type: String,
      index: true,
    },
    geo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ geo: "2dsphere" });

const Event = mongoose.model("Event", eventSchema);

export default Event;
