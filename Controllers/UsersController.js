import express from "express";
import { RegisterUser, Login } from "../Services/UserService.js";
import { app } from "../index.js";

const UserRouter = express.Router();

UserRouter.post("/register", async (req, res) => {
  try {
    return await RegisterUser(req, res);
  } catch (e) {
    console.log(e.message);
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    await app.oauth.grant();
    Login();
    //todo
    return res.status(200);
  } catch (e) {
    console.log(e.message);
  }
});

export default UserRouter;
