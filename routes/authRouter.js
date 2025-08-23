import express from "express";
import { login, logout, signup } from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validation/userValidation.js";

export const authrouter = express.Router();

authrouter.post("/signup", validate(registerSchema), signup);
authrouter.post("/login", validate(loginSchema), login);
authrouter.get("/logout", logout);
