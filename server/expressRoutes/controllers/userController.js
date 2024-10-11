import User from "../../model/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

// creating token =================================================================================
const createToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: "2d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV != "development",
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
  return token;
};

//controllers =====================================================================================
export default class UserAPI {
  // create account
  static async createUser(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("All fields are required.");
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username is already in used." });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      try {
        await User.create({ username, password: hashedPass });
        return res.status(200).json({ message: "Account has been created" });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("All fields are required.");
    }

    const user = await User.findOne({ username });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        createToken(res, user._id);
        return res.status(200).json({ id: user._id, username: user.username });
      } else {
        return res.status(400).json({ error: "Incorrect email or password" });
      }
    } else {
      return res.status(400).json({ error: "Incorrect username or password" });
    }
  }

  static async logout(req, res) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logged out successfully" });
  }
}
