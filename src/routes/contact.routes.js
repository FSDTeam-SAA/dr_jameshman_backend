import { Router } from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getSingleContact,
} from "../controllers/contact.controller.js";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.route("/").post(createContact).get(isLogegdin, isAdmin, getAllContacts);
router
  .route("/:contactId")
  .get(isLogegdin, isAdmin, getSingleContact)
  .delete(isLogegdin, isAdmin, deleteContact);

export default router;
