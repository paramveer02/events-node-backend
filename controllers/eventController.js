import { asyncWrapper } from "../utils/asyncWrapper.js";
import Event from "../models/Event.js";
import { StatusCodes } from "http-status-codes";
import { geoCodeAddress, reverseGeocode } from "../utils/geoCode.js";
import { NotFoundError } from "../errors/customErrors.js";

export const createEvent = asyncWrapper(async function (req, res, next) {
  const { title, description, date, location } = req.body;

  const { lat, lng, formattedAddress, city } = await geoCodeAddress(location);

  const payload = {
    title,
    description,
    date,
    location,
    city: city?.toLowerCase(),
    geo: {
      type: "Point",
      coordinates: [lng, lat],
    },
    organizer: req.user.id,
  };

  const event = await Event.create(payload);

  res.status(StatusCodes.CREATED).json({ stats: "success", event });
});

export const getMyEvents = asyncWrapper(async function (req, res) {
  const events = await Event.find({ organizer: req.user.id }).sort({
    date: 1,
  });
  res
    .status(StatusCodes.OK)
    .json({ status: "success", results: events.length, events });
});

// controllers/eventController.js
export const getEventsNearMe = asyncWrapper(async function (req, res) {
  let { lat, lng, radiusKm = 25, city } = req.query;

  // Case 1: user passed city manually
  if (city && (!lat || !lng)) {
    const events = await Event.find({ city: city.toLowerCase() })
      .sort({ date: 1 })
      .limit(100);
    return res
      .status(200)
      .json({ status: "success", results: events.length, events });
  }

  // Case 2: user gave coordinates
  if (!lat || !lng) {
    return res
      .status(400)
      .json({ status: "fail", message: "lat and lng are required" });
  }

  const latitude = Number(lat);
  const longitude = Number(lng);

  const userCity = await reverseGeocode(latitude, longitude);
  if (!userCity) {
    return res
      .status(404)
      .json({ status: "fail", message: "Could not determine city" });
  }

  const events = await Event.find({ city: userCity.toLowerCase() })
    .sort({ date: 1 })
    .limit(100)
    .populate("organizer");

  res.status(200).json({
    status: "success",
    city: userCity,
    results: events.length,
    events,
  });
});

export const deleteMyEvent = asyncWrapper(async function (req, res) {
  const event = await Event.findById(req.params.id);

  if (!event) throw new NotFoundError("Event not found");
  if (event.organizer.toString() !== req.user.id) {
    throw new UnauthorizedError("You can only delete your own events");
  }

  await event.deleteOne();
  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "Event deleted" });
});

export const getAllEvents = asyncWrapper(async (_req, res) => {
  const events = await Event.find()
    .sort({ date: 1 })
    .limit(200)
    .populate("organizer");
  res
    .status(StatusCodes.OK)
    .json({ status: "success", results: events.length, events });
});

export const getCurrentEvent = asyncWrapper(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizer");
  if (!event) throw new NotFoundError("Event not found");

  res.status(StatusCodes.OK).json({ status: "success", event });
});
