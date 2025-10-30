import { Router } from "express";
import {
  createReferral,
  deleteReferral,
  getAllReferral,
  getReferralById,
} from "../controllers/referral.controller.js";
import upload from "../middleware/multer.js";

const router = Router();

router
  .route("/")
  .post(upload.array("files", 5), createReferral, createReferral)
  .get(getAllReferral);

router.route("/:id").get(getReferralById).delete(deleteReferral);

export default router;
