import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getSingleBooking,
} from "../controllers/booking.controller.js";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.route("/").post(createBooking).get(isLogegdin, isAdmin, getAllBookings);
router
  .route("/:id")
  .get(isLogegdin, isAdmin, getSingleBooking)
  .delete(isLogegdin, isAdmin, deleteBooking);

export default router;
