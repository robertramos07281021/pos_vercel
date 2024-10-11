import jwt from "jsonwebtoken";
import User from "../model/users.js";

const authenticate = async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorize, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorize, no token" });
  }
};

export default authenticate;
