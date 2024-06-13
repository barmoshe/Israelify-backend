import express from "express";
import http from 'http'
import cookieParser from "cookie-parser";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { logger } from "./services/logger.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

logger.info("server.js loaded...");

const app = express();
const server = http.createServer(app)


// Express App Config
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// Configuring CORS
const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  console.log("production environment");
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, "public")));
  console.log("__dirname: ", __dirname);
}

import { authRoutes } from "./api/auth/auth.routes.js";
import { userRoutes } from "./api/user/user.routes.js";
import { stationRoutes } from "./api/station/station.routes.js";
import { setupSocketAPI } from './services/socket.service.js'


// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/station", stationRoutes);

setupSocketAPI(server)

// Make every unmatched server-side-route fall back to index.html
// So when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there

app.get("/**", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

const port = process.env.PORT || 3030;

server.listen(port, () => {
  logger.info("Server is running on port: " + port);
});
