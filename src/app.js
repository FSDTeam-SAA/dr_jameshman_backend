import express from "express";
import cors from "cors";
import treatmentListRouter from "./routes/treatmentList.routes.js";
import contactRouter from "./routes/contact.routes.js";
import faqRouter from "./routes/faq.routes.js";
import treatmentFeeRouter from "./routes/treatmentFees.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import galleryRouter from "./routes/gallery.routes.js";
import userRouter from "./routes/user.routes.js";
import referralRouter from "./routes/referral.routes.js";
import treatmentCategoryRouter from "./routes/treatmentCategory.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import contactInfoRouter from "./routes/contactInfo.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// main route
app.get("/", (_, res) => {
  return res.status(200).send("<h2>Server is running....!</h2>");
});

// treatment list routes
app.use("/api/v1/treatments", treatmentListRouter);

// contact routes
app.use("/api/v1/contacts", contactRouter);

// faq routes
app.use("/api/v1/faqs", faqRouter);

// treatment fee routes
app.use("/api/v1/treatmentfees", treatmentFeeRouter);

// booking routes
app.use("/api/v1/bookings", bookingRouter);

// gallery routes
app.use("/api/v1/galleries", galleryRouter);

// user routes
app.use("/api/v1/users", userRouter);

// referral routes
app.use("/api/v1/referrals", referralRouter);

// treatment category routes
app.use("/api/v1/treatmentCategories", treatmentCategoryRouter);

// doctor routes
app.use("/api/v1/doctors", doctorRouter);

// contact info routes
app.use("/api/v1/contact-info", contactInfoRouter);

export default app;
