import { Router } from "express";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createContactInfo,
  deleteContactInfo,
  getAllContactInfos,
  getContactInfoById,
  updateContactInfo,
} from "../controllers/contactInfo.controller.js";

const router = Router();

router
  .route("/")
  .post(isLogegdin, isAdmin, createContactInfo)
  .get(getAllContactInfos);

router
  .route("/:id")
  .put(isLogegdin, isAdmin, updateContactInfo)
  .get(getContactInfoById)
  .delete(isLogegdin, isAdmin, deleteContactInfo);

export default router;
