import express from "express";
import upload from "../middleware/multer.js";
import {
  createGallery,
  deleteGallery,
  getAllGalleries,
  getSingleGallery,
  updateGallery,
} from "../controllers/gallery.controller.js";
import { isLogegdin } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router
  .route("/")
  .post(
    isLogegdin,
    isAdmin,
    upload.fields([
      { name: "before", maxCount: 1 },
      { name: "after", maxCount: 1 },
    ]),
    createGallery
  )
  .get(getAllGalleries);

router
  .route("/:id")
  .get(getSingleGallery)
  .delete(isLogegdin, isAdmin, deleteGallery)
  .put(
    isLogegdin,
    isAdmin,
    upload.fields([
      { name: "before", maxCount: 1 },
      { name: "after", maxCount: 1 },
    ]),
    updateGallery
  );

export default router;
