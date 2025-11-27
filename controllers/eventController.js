import { asyncWrapper } from "../utils/asyncWrapper.js";
import Event from "../models/Event.js";
import { StatusCodes } from "http-status-codes";
import { geoCodeAddress, reverseGeocode } from "../utils/geoCode.js";
import { NotFoundError, UnauthorizedError } from "../errors/customErrors.js";

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
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 per page
  const skip = (page - 1) * limit;

  // Run queries in parallel for better performance
  const [events, total] = await Promise.all([
    Event.find({ organizer: req.user.id })
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .lean(), // lean() for read-only queries - faster and uses less memory
    Event.countDocuments({ organizer: req.user.id }),
  ]);

  res.status(StatusCodes.OK).json({
    status: "success",
    results: events.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    events,
  });
});

// controllers/eventController.js
export const getEventsNearMe = asyncWrapper(async function (req, res) {
  let { lat, lng, radiusKm = 25, city, page = 1, limit = 50 } = req.query;

  // Parse pagination params
  const pageNum = parseInt(page) || 1;
  const limitNum = Math.min(parseInt(limit) || 50, 100); // Max 100 per page
  const skip = (pageNum - 1) * limitNum;

  // Case 1: user passed city manually (no coordinates)
  if (city && (!lat || !lng)) {
    const [events, total] = await Promise.all([
      Event.find({ city: city.toLowerCase() })
        .sort({ date: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate("organizer", "name email")
        .lean(),
      Event.countDocuments({ city: city.toLowerCase() }),
    ]);

    return res.status(200).json({
      status: "success",
      results: events.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      events,
    });
  }

  // Case 2: user gave coordinates - use geospatial query
  if (!lat || !lng) {
    return res
      .status(400)
      .json({ status: "fail", message: "lat and lng are required" });
  }

  const latitude = Number(lat);
  const longitude = Number(lng);
  const radiusMeters = Number(radiusKm) * 1000;

  // Use $geoNear for radius-based search (most performant for geo queries)
  const events = await Event.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distance",
        maxDistance: radiusMeters,
        spherical: true,
        query: {}, // Can add additional filters here
      },
    },
    { $sort: { date: 1 } },
    { $skip: skip },
    { $limit: limitNum },
    {
      $lookup: {
        from: "users",
        localField: "organizer",
        foreignField: "_id",
        as: "organizer",
      },
    },
    { $unwind: "$organizer" },
    {
      $project: {
        "organizer.password": 0,
        "organizer.passwordChangedAt": 0,
        "organizer.__v": 0,
      },
    },
  ]);

  // Get total count for pagination
  const totalCount = await Event.countDocuments({
    geo: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radiusMeters,
      },
    },
  });

  // Get city name from reverse geocoding
  const userCity = await reverseGeocode(latitude, longitude);

  res.status(200).json({
    status: "success",
    city: userCity || "Unknown",
    results: events.length,
    total: totalCount,
    page: pageNum,
    totalPages: Math.ceil(totalCount / limitNum),
    radiusKm: Number(radiusKm),
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

export const getAllEvents = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 per page
  const skip = (page - 1) * limit;

  // Run queries in parallel for better performance
  const [events, total] = await Promise.all([
    Event.find()
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .populate("organizer", "name email")
      .lean(), // lean() for read-only queries - faster and uses less memory
    Event.countDocuments(),
  ]);

  res.status(StatusCodes.OK).json({
    status: "success",
    results: events.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    events,
  });
});

export const getCurrentEvent = asyncWrapper(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("organizer", "name email")
    .lean();

  if (!event) throw new NotFoundError("Event not found");

  res.status(StatusCodes.OK).json({ status: "success", event });
});
