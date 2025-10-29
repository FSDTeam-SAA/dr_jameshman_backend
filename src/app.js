import express from "express";
import cors from "cors";
import treatmentListRouter from "./routes/treatmentList.routes.js";
import contactRouter from "./routes/contact.routes.js";

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

export default app;
