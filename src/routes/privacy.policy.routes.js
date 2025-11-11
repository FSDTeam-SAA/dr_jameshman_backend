import { Router } from "express";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createPrivacyPolicy,
  editPrivacyPolicy,
  getPrivacyPolicy,
} from "../controllers/privacy.policy.controller.js";

const router = Router();

router
  .route("/")
  .post(isLogegdin, isAdmin, createPrivacyPolicy)
  .get(getPrivacyPolicy);

router.route("/edit-policy").put(isLogegdin, isAdmin, editPrivacyPolicy);

export default router;
