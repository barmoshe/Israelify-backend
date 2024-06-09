import { stationService } from "./station.service.js";
import { logger } from "../../services/logger.service.js";

export async function getStations(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || "",
    };
    logger.debug("Getting Stations", filterBy);
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
    logger.debug(`Getting Station ${stationId}`);
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
    logger.debug(`Adding Station`, station);
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
    logger.debug(`Updating Station`, station);
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
    logger.debug(`Deleting Station ${stationId}`);
    await stationService.remove(stationId);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to remove station", err);
    res.status(500).send({ err: "Failed to remove station" });
  }
}
