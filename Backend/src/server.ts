import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import prisma from "./config/prisma";
import cors from "cors";
import mainRouter from "./routes/main";

import { create_inital_database_entry } from "./config/inital_database_entry";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const app_name = process.env.APP_NAME;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // React app's origin
    credentials: true, // Allow cookies to be sent
  })
);

// main router configuration
app.use("/api", mainRouter);

// Start the server, and prisma client
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  prisma.$connect().then(() => console.log("Database connected"));

  create_inital_database_entry()
    .then(() => console.log("Initial database entry created"))
    .catch((e) => console.error(e));
});

export default app;
