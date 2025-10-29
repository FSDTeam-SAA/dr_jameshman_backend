import { Router } from "express";
import {
  createFAQ,
  deleteFAQ,
  editFAQ,
  getAllFAQs,
  getSingleFAQ,
} from "../controllers/faq.controller.js";

const router = Router();

router.route("/").post(createFAQ).get(getAllFAQs);
router.route("/:faqId").get(getSingleFAQ).put(editFAQ).delete(deleteFAQ);

export default router;
