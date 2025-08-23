import { Router } from "express";
import { getCityGuide } from "../controllers/aiController.js";

const aiRouter = Router();

aiRouter.post("/city-guide", getCityGuide);

export default aiRouter;
