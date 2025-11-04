import { Router } from "express";
import {
  createReferral,
  deleteReferral,
  getAllReferral,
  getReferralById,
} from "../controllers/referral.controller.js";
import upload from "../middleware/multer.js";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router
  .route("/")
  .post(upload.array("files", 5), createReferral, createReferral)
  .get(isLogegdin, isAdmin, getAllReferral);

router
  .route("/:id")
  .get(isLogegdin, isAdmin, getReferralById)
  .delete(isLogegdin, isAdmin, deleteReferral);

export default router;
