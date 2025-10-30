import express from "express";
import upload from "../middleware/multer.js";
import {
  createGallery,
  deleteGallery,
  getAllGalleries,
  getSingleGallery,
  updateGallery,
} from "../controllers/gallery.controller.js";

const router = express.Router();

router
  .route("/")
  .post(upload.single("image"), createGallery)
  .get(getAllGalleries);

router
  .route("/:id")
  .get(getSingleGallery)
  .delete(deleteGallery)
  .put(updateGallery);

export default router;
