import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDb from "./config/mongodb.js";

import meetingRouter from "./routes/meetingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import mediaRouter from "./routes/mediaRoutes.js";
import websiteRouter from "./routes/websiteRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

/*
|--------------------------------------------------------------------------
| Body parser
|--------------------------------------------------------------------------
*/

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

connectDb();

/*
|--------------------------------------------------------------------------
| API routes
|--------------------------------------------------------------------------
*/

app.use("/api/meeting", meetingRouter);

app.use("/api/admin", adminRouter);

app.use("/api/media", mediaRouter);

app.use("/api/website", websiteRouter);

app.use("/api/review", reviewRouter);

/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Being IBAN Digital API working",
  });
});

/*
|--------------------------------------------------------------------------
| API 404
|--------------------------------------------------------------------------
*/

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
