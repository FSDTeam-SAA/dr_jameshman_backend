import express from "express";
// import upload from "../middleware/multer.js";
import {
  createGallery,
  deleteGallery,
  getAllGalleries,
  getSingleGallery,
} from "../controllers/gallery.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router
  .route("/")
  .post(upload.single("image"), createGallery)
  .get(getAllGalleries);

router.route("/:id").get(getSingleGallery).delete(deleteGallery);

export default router;
