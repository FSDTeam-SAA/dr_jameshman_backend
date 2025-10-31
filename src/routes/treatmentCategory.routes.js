import { Router } from "express";
import {
  createTreatmentCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/treatmentCategory.controller.js";
import upload from "../middleware/multer.js";

const router = Router();

router
  .route("/")
  .post(upload.single("image"), createTreatmentCategory)
  .get(getAllCategories);
router
  .route("/:id")
  .put(upload.single("image"), updateCategory)
  .delete(deleteCategory)
  .get(getSingleCategory);

export default router;
