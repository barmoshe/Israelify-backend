import { dbService } from "../../services/db.service.js";
import { logger } from "../../services/logger.service.js";

import mongodb from "mongodb";
const { ObjectId } = mongodb;

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
};

async function query(filterBy = {}) {
  const criteria = _buildCriteria({});
  try {
    const collection = await dbService.getCollection("user");
    var users = await collection.find(criteria).toArray();
    users = users.map((user) => {
      delete user.password;
      return user;
    });
    return users;
  } catch (err) {
    logger.error("cannot find users", err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ _id: ObjectId(userId) });
    delete user.password;
    return user;
  } catch (err) {
    logger.error(`while finding user ${userId}`, err);
    throw err;
  }
}
async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ username });
    logger.debug(user);
    return user;
  } catch (err) {
    logger.error(`while finding user ${username}`, err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection("user");
    await collection.deleteOne({ _id: ObjectId(userId) });
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err);
    throw err;
  }
}
// {
//     "_id": "6663069583cabc236be78995",
//     "fullname": "admin",
//     "username": "admin",
//     "imgUrl": "https://t3.ftcdn.net/jpg/00/65/75/68/240_F_65756860_GUZwzOKNMUU3HldFoIA44qss7ZIrCG8I.jpg",
// }

async function update(user) {
  try {
    // peek only updatable fields!
    const userToSave = {
      ...user,
      _id: ObjectId(user._id),
      username: user.username,
      fullname: user.fullname,
      password: user.password,
      imgUrl: user.imgUrl,
    };

    const collection = await dbService.getCollection("user");
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
    return userToSave;
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err);
    throw err;
  }
}

async function add(user) {
  try {
    // Validate that there are no such user:
    const existUser = await getByUsername(user.username);
    if (existUser) throw new Error("Username taken");

    // peek only updatable fields!
    const userToAdd = {
      ...user,
      fullname: user.fullname,
      username: user.username,
      password: user.password,
      imgUrl: user.imgUrl,
    };
    const collection = await dbService.getCollection("user");
    await collection.insertOne(userToAdd);
    return userToAdd;
  } catch (err) {
    logger.error("cannot insert user", err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: "i" };
    criteria.$or = [
      {
        username: txtCriteria,
      },
      {
        fullname: txtCriteria,
      },
    ];
  }
  if (filterBy.minBalance) {
    criteria.balance = { $gte: filterBy.minBalance };
  }
  return criteria;
}
