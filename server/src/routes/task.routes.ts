import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// Apply 'protect' middleware to all routes below
router.use(protect);

router.post("/", taskController.create);
router.get("/", taskController.getAll);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.remove);

export default router;