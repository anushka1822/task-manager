import { Router } from "express";
import * as authController from "../controllers/auth.controller";

import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.put("/profile", protect, authController.updateProfile);
router.get("/users", protect, authController.getUsers);

export default router;