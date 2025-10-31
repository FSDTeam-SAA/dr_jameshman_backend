import { Router } from "express";
import {
  createTreatmentList,
  deleteTreatmentList,
  getAllTreatmentList,
  getSingleTreatmentList,
  updateTreatmentList,
} from "../controllers/treatmentList.controller.js";
import upload from "../middleware/multer.js";

const router = Router();

router
  .route("/")
  .post(upload.single("image"), createTreatmentList)
  .get(getAllTreatmentList);
router
  .route("/:id")
  .get(getSingleTreatmentList)
  .put(upload.single("image"), updateTreatmentList)
  .delete(deleteTreatmentList);

export default router;
