import mongodb from "mongodb";
const { ObjectId } = mongodb;

import { dbService } from "../../services/db.service.js";
import { logger } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";

async function query(filterBy = { txt: "" }) {
  try {
    const criteria = {};
    const collection = await dbService.getCollection("station");
    var stations = await collection.find();

    return stations.toArray();
  } catch (err) {
    logger.error("cannot find stations", err);
    throw err;
  }
}

async function getById(stationId) {
  try {
    const collection = await dbService.getCollection("station");
    const station = await collection.findOne({ _id: ObjectId(stationId) });
    if (station) station.createdAt = ObjectId(station._id).getTimestamp();
    return station;
  } catch (err) {
    logger.error(`while finding station ${stationId}`, err);
    throw err;
  }
}

async function remove(stationId) {
  try {
    const collection = await dbService.getCollection("station");
    await collection.deleteOne({ _id: ObjectId(stationId) });
  } catch (err) {
    logger.error(`cannot remove station ${stationId}`, err);
    throw err;
  }
}

async function add(station) {
  try {
    const collection = await dbService.getCollection("station");
    await collection.insertOne(station);
    return station;
  } catch (err) {
    logger.error("cannot insert station", err);
    throw err;
  }
}
async function update(station) {
  try {
    const stationId = station._id;
    const stationToSave = {
      ...station,
      _id: ObjectId(station._id),
    };
    const collection = await dbService.getCollection("station");
    await collection.updateOne(
      { _id: ObjectId(station._id) },
      { $set: stationToSave }
    );
    return station;
  } catch (err) {
    logger.error(`cannot update car ${station._id}`, err);
    throw err;
  }
}

export const stationService = {
  query,
  getById,
  remove,
  add,
  update,
};
