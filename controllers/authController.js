import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { createSendToken } from "../utils/createSendToken.js";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors/customErrors.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

export const signup = asyncWrapper(async function (req, res) {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new BadRequestError("Email already exists");

  const user = await User.create({ name, email, password, role: "user" });
  createSendToken(user, StatusCodes.CREATED, res);
});

export const login = asyncWrapper(async function (req, res) {
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new UnauthenticatedError("Please check your credentials");
  }

  createSendToken(user, StatusCodes.OK, res);
});

export const logout = function (req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: false,
  });
  res.status(StatusCodes.OK).json({ message: "User logged out" });
};
