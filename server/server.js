import express from "express";
import mongoose from "mongoose";
import { posRouter } from "./expressRoutes/routers/posRouter.js";
import { userRouter } from "./expressRoutes/routers/userRoute.js";
const app = express();
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/client/dist")));
app.use("/assets", express.static(path.join(__dirname, "/client/assets")));
app.use("/api/productions", posRouter);
app.use("/api/users", userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

mongoose
  .connect(process.env.DB_URI, { dbName: "pos_system" })
  .then(() => console.log("MongoDB database connected!"))
  .catch((err) => console.log(err));

// .connect("mongodb://127.0.0.1:27017/pos_db")
// .then(() => {
//   console.log("Connection open");
// })
// .catch((err) => {
//   console.lor(err);
// });

app.listen(process.env.PORT, () => {
  console.log(`App is running on http://localhost:${process.env.PORT}`);
});
