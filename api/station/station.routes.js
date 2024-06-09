import express from "express";
import { requireAuth } from "../../middlewares/requireAuth.middleware.js";
import { log } from "../../middlewares/logger.middleware.js";
import {
  getStations,
  getStationById,
  addStation,
  updateStation,
  removeStation,
} from "./station.controller.js";

export const stationRoutes = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

stationRoutes.get("/", log, getStations);
stationRoutes.get("/:id", getStationById);
stationRoutes.post("/", addStation);
stationRoutes.put("/", updateStation);
stationRoutes.delete("/:id", removeStation);

// carRoutes.get("/", log, getCars);
// carRoutes.get("/:id", getCarById);
// carRoutes.post("/", requireAuth, addCar);
// carRoutes.put("/:id", requireAuth, updateCar);
// carRoutes.delete("/:id", requireAuth, removeCar);
//// router.delete('/:id', requireAuth, requireAdmin, removeCar)
