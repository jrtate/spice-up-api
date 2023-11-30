import express from "express";
import { AuthenticateToken } from "../Services/AuthService.js";
import {
  GetSettingsAsync,
  UpsertSettingsAsync,
} from "../Services/SettingsService.js";

const SettingsRouter = express.Router();

SettingsRouter.get("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    const results = await GetSettingsAsync(user);
    res.json(results);
  } catch (e) {
    console.log(e.message);
  }
});

SettingsRouter.put("", async (req, res) => {
  try {
    const user = await AuthenticateToken(req, res);
    await UpsertSettingsAsync(req.body, user);
    return res.status(200).json({});
  } catch (e) {
    console.log(e.message);
  }
});

export default SettingsRouter;
