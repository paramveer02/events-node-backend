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

// Geospatial index for location-based queries
eventSchema.index({ geo: "2dsphere" });

// Compound indexes for optimized queries
eventSchema.index({ city: 1, date: 1 }); // For city-based event searches sorted by date
eventSchema.index({ organizer: 1, date: 1 }); // For user's own events sorted by date
eventSchema.index({ date: 1 }); // For general date-based queries

const Event = mongoose.model("Event", eventSchema);

export default Event;
