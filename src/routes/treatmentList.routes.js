import { Router } from "express";
import {
  createTreatmentList,
  deleteTreatmentList,
  getAllTreatmentList,
  getSingleTreatmentList,
  getTreatmentListByCategory,
  updateTreatmentList,
} from "../controllers/treatmentList.controller.js";
import upload from "../middleware/multer.js";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router
  .route("/")
  .post(isLogegdin, isAdmin, upload.single("image"), createTreatmentList)
  .get(getAllTreatmentList);
router
  .route("/:id")
  .get(getSingleTreatmentList)
  .put(isLogegdin, isAdmin, upload.single("image"), updateTreatmentList)
  .delete(isLogegdin, isAdmin, deleteTreatmentList);

router.route("/treatmentCategory/:categoryId").get(getTreatmentListByCategory);

export default router;
