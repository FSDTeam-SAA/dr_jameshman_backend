import { Router } from "express";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} from "../controllers/doctor.controller.js";
import upload from "../middleware/multer.js";

const router = Router();

router
  .route("/")
  .post(isLogegdin, isAdmin, upload.single("image"), createDoctor)
  .get(getAllDoctors);

router
  .route("/:id")
  .put(isLogegdin, isAdmin, upload.single("image"), updateDoctor)
  .delete(isLogegdin, isAdmin, deleteDoctor)
  .get(getDoctorById);

export default router;
