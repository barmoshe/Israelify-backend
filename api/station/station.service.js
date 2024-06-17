import mongodb from "mongodb";
import axios from "axios";
const { ObjectId } = mongodb;
import "dotenv/config";

import { dbService } from "../../services/db.service.js";
import { logger } from "../../services/logger.service.js";

const OPENAI_API_KEY = process.env.OPEN_AI_API_KEY;
async function query(filterBy = { txt: "" }) {
  try {
    const criteria = {};
    const collection = await dbService.getCollection("station");
    //sort collection by index ascending
    var stations = await collection.find().sort({ index: 1 });

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
  const stationToAdd = { ...station, index: 1 };
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
    logger.error(`cannot update station ${station._id}`, err);
    throw err;
  }
}

async function getRecommendations(userPrompt) {
  const apiKey = OPENAI_API_KEY;
  console.log("API KEY:", apiKey);
  const url = "https://api.openai.com/v1/completions";

  const requestBody = {
    model: "gpt-3.5-turbo-instruct",
    prompt: `You are an advanced music recommendation engine. Based on the user's input: "${userPrompt}", provide a list of 20 diverse song recommendations. Each recommendation should be formatted as follows:
  - Song Name: [song name]
  - Artist: [artist name]
  Ensure that each recommendation is on a new line, clearly listed, and includes a variety of genres and artists.`,
    temperature: 0.8,
    max_tokens: 300,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const recommendations = response.data.choices[0].text;
    console.log("Recommendations:", response);
    const lines = recommendations
      .split("\n")
      .filter((line) => line.trim() !== "");
    const songs = [];
    for (let i = 0; i < lines.length; i += 2) {
      if (lines[i] && lines[i + 1]) {
        const name = lines[i].replace("Song Name: ", "").trim();
        const artist = lines[i + 1].replace("Artist: ", "").trim();
        songs.push({ name, artist });
      }
    }
    return songs;
  } catch (err) {
    logger.error("Failed to get recommendations", err);
    throw err;
  }
}

export const stationService = {
  query,
  getById,
  remove,
  add,
  update,
  getRecommendations,
};
