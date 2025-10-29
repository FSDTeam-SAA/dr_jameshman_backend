import { Router } from "express";
import {
  createTreatmentFee,
  deleteTreatmentFee,
  getAllTreatmentFees,
  getTreatmentFeeById,
  updateTreatmentFee,
} from "../controllers/treatmentFees.controller.js";


const router = Router();

router.route("/").post(createTreatmentFee).get(getAllTreatmentFees);
router.route("/:id").put(updateTreatmentFee).delete(deleteTreatmentFee).get(getTreatmentFeeById);

export default router;
