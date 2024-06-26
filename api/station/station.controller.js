import { stationService } from "./station.service.js";
import { logger } from "../../services/logger.service.js";

export async function getStations(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || "",
    };
    const stations = await stationService.query(filterBy);
    res.json(stations);
  } catch (err) {
    logger.error("Failed to get stations", err);
    res.status(500).send({ err: "Failed to get stations" });
  }
}

export async function getStationById(req, res) {
  try {
    const stationId = req.params.id;
    const station = await stationService.getById(stationId);
    if (!station) {
      res.status(404).send({ err: "Station not found" });
      return;
    }
    res.json(station);
  } catch (err) {
    logger.error("Failed to get station", err);
    res.status(500).send({ err: "Failed to get station" });
  }
}

export async function addStation(req, res) {
  const { loggedinUser } = req;

  try {
    const station = req.body;
    station.createdBy = loggedinUser ? loggedinUser._id : station.createdBy;
    const addedStation = await stationService.add(station);

    res.json(addedStation);
  } catch (err) {
    logger.error("Failed to add station", err);
    res.status(500).send({ err: "Failed to add station" });
  }
}

export async function updateStation(req, res) {
  try {
    const station = req.body;
    const updatedStation = await stationService.update(station);
    res.json(updatedStation);
  } catch (err) {
    logger.error("Failed to update station", err);
    res.status(500).send({ err: "Failed to update station" });
  }
}

export async function removeStation(req, res) {
  try {
    const stationId = req.params.id;
    await stationService.remove(stationId);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to remove station", err);
    res.status(500).send({ err: "Failed to remove station" });
  }
}

export async function getRecommendations(req, res) {
  const userPrompt = req.body.userPrompt;
  try {
    const recommendations = await stationService.getRecommendations(userPrompt);
    res.json(recommendations);
  } catch (err) {
    logger.error("Failed to get recommendations", err);
    res.status(500).send({ err: "Failed to get recommendations" });
  }
}
