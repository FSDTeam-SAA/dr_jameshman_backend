import { Router } from "express";
import {
  createTreatmentList,
  getTreatmentLists,
} from "../controllers/treatmentList.controller.js";

const router = Router();

// routes
router.route("/create-treatmentList").post(createTreatmentList);
router.route("/").get(getTreatmentLists);

export default router;
