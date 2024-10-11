import { Router } from "express";
import UserAPI from "../controllers/userController.js";
const router = Router();
import { validateCreateUser } from "../../middleware/validation.js";

router.post("/create", validateCreateUser, UserAPI.createUser);
router.post("/login", UserAPI.login);
router.post("/logout", UserAPI.logout);

export { router as userRouter };
