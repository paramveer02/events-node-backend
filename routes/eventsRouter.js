import express from "express";
import {
  createEvent,
  deleteMyEvent,
  getAllEvents,
  getEventsNearMe,
  getMyEvents,
  getCurrentEvent,
} from "../controllers/eventController.js";
import { authenticate } from "../middlewares/authenticate.js";

export const eventRouter = express.Router();

// public
eventRouter.get("/", getAllEvents);
eventRouter.get("/near", getEventsNearMe);

// protected
eventRouter.use(authenticate);
eventRouter.route("/").post(createEvent);
eventRouter.route("/mine").get(getMyEvents);
eventRouter.route("/:id").get(getCurrentEvent);
eventRouter.route("/:id").delete(deleteMyEvent);
