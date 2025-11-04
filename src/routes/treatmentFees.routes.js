import { Router } from "express";
import {
  createTreatmentFee,
  deleteTreatmentFee,
  getAllTreatmentFees,
  getTreatmentFeeById,
  updateTreatmentFee,
} from "../controllers/treatmentFees.controller.js";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router
  .route("/")
  .post(isLogegdin, isAdmin, createTreatmentFee)
  .get(getAllTreatmentFees);
router
  .route("/:id")
  .put(isLogegdin, isAdmin, updateTreatmentFee)
  .delete(isLogegdin, isAdmin, deleteTreatmentFee)
  .get(getTreatmentFeeById);

export default router;
