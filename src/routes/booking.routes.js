import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getSingleBooking,
} from "../controllers/booking.controller.js";

const router = Router();

router.route("/").post(createBooking).get(getAllBookings);
router.route("/:id").get(getSingleBooking).delete(deleteBooking);

export default router;
