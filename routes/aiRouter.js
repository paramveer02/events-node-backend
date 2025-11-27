import { Router } from "express";
import {
  getCityGuide,
  getCityGuideQuery,
} from "../controllers/aiController.js";

const aiRouter = Router();

// Support both POST with body and GET with query params
aiRouter.post("/city-guide", getCityGuide);
aiRouter.get("/city-guide", getCityGuideQuery);

export default aiRouter;
