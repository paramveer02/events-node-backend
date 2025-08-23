import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      validate: [validator.isEmail, "Please provide a correct email"],
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      validate: {
        validator: (v) => v === true || v === false,
        message: "isActive must be true or false, not null",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.changedPasswordAfter = function (JWTissuedAt) {
  if (!this.passwordChangedAt) return false;

  const passwordChangedAtTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );

  return JWTissuedAt < passwordChangedAtTimestamp;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  hashedPassword
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
