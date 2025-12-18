import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ message: "No token" });

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id).select("-password");
  next();
};

export const admin = (req, res, next) => {
  if (req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin only" });
};
