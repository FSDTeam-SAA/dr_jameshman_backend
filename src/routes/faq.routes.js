import { Router } from "express";
import {
  createFAQ,
  deleteFAQ,
  editFAQ,
  getAllFAQs,
  getSingleFAQ,
} from "../controllers/faq.controller.js";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.route("/").post(isLogegdin, isAdmin, createFAQ).get(getAllFAQs);
router
  .route("/:faqId")
  .get(isLogegdin, isAdmin, getSingleFAQ)
  .put(isLogegdin, isAdmin, editFAQ)
  .delete(isLogegdin, isAdmin, deleteFAQ);

export default router;
