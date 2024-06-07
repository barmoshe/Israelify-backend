import Cryptr from "cryptr";
import bcrypt from "bcrypt";

import { userService } from "../user/user.service.js";
import { logger } from "../../services/logger.service.js";

export const authService = {
  signup,
  login,
  getLoginToken,
  validateToken,
};

const cryptr = new Cryptr(process.env.SECRET1 || "Secret-Puk-1234");

async function login(username, password) {
  logger.debug(`auth.service - login with username: ${username}`);

  const user = await userService.getByUsername(username);
  if (!user) throw new Error("Invalid username or password"); //invalid username

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid username or password"); //invalid password

  delete user.password;
  return user;
}

async function signup(username, password, fullname, imgUrl) {
  const saltRounds = 10;

  logger.debug(
    `auth.service - signup with username: ${username}, fullname: ${fullname}`
  );
  if (!username || !password || !fullname || !imgUrl)
    throw new Error("username, password, fullname and imgUrl are required");

  const hash = await bcrypt.hash(password, saltRounds);
  try {
    const user = await userService.add({
      username,
      password: hash,
      fullname,
      imgUrl,
    });
    return user;
  } catch (err) {
    logger.error("Failed to signup------>", err);
    throw err;
  }
}

function getLoginToken(user) {
  const userInfo = {
    _id: user._id,
    fullname: user.fullname,
    username: user.username,
    imgUrl: user.imgUrl,
  };
  return cryptr.encrypt(JSON.stringify(userInfo));
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken);
    const loggedinUser = JSON.parse(json);
    return loggedinUser;
  } catch (err) {
    console.log("Invalid login token");
  }
  return null;
}
