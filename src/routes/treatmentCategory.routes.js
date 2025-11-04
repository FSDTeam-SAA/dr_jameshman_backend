import { Router } from "express";
import {
  createTreatmentCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/treatmentCategory.controller.js";
import upload from "../middleware/multer.js";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router
  .route("/")
  .post(isLogegdin, isAdmin, upload.single("image"), createTreatmentCategory)
  .get(getAllCategories);
router
  .route("/:id")
  .put(isLogegdin, isAdmin, upload.single("image"), updateCategory)
  .delete(isLogegdin, isAdmin, deleteCategory)
  .get(getSingleCategory);

export default router;
