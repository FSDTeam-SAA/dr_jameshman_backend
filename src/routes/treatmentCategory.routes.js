import { Router } from "express";
import { createTreatmentCategory } from "../controllers/treatmentCategory.controller.js";

const router = Router();

router.route("/").post(createTreatmentCategory);

export default router;
