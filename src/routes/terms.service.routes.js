import { Router } from "express";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createTermsOfService,
  editTermsOfService,
  getTermsOfService,
} from "../controllers/terms.service.controller.js";

const router = Router();

router
  .route("/")
  .post(isLogegdin, isAdmin, createTermsOfService)
  .get(getTermsOfService);

router.route("/edit-terms").put(isLogegdin, isAdmin, editTermsOfService);

export default router;
