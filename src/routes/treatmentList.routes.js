import { Router } from "express";
import {
  createTreatmentList,
  editTreatmentList,
  getTreatmentLists,
} from "../controllers/treatmentList.controller.js";

const router = Router();

// routes
router.route("/create-treatmentList").post(createTreatmentList);
router.route("/edit-treatmentList").put(editTreatmentList);
router.route("/").get(getTreatmentLists);

export default router;
