import { Router } from "express";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createGDPR,
  editGDPR,
  getGDPR,
} from "../controllers/gdpr.controller.js";

const router = Router();

router.route("/").post(isLogegdin, isAdmin, createGDPR).get(getGDPR);

router.route("/update").put(isLogegdin, isAdmin, editGDPR);

export default router;
