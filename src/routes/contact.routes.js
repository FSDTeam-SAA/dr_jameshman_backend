import { Router } from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getSingleContact,
} from "../controllers/contact.controller.js";

const router = Router();

router.route("/").post(createContact).get(getAllContacts);
router.route("/:contactId").get(getSingleContact).delete(deleteContact);

export default router;
