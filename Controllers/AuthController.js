import LocalStrategy from "passport-local";
import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
import {
  AuthenticateUserAsync,
  CreateUserAsync,
  VerifyRefresh,
} from "../Services/AuthService.js";

const AuthRouter = express.Router();

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => CreateUserAsync(email, password, done),
  ),
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) =>
      AuthenticateUserAsync(email, password, done),
  ),
);

AuthRouter.post(
  "/signup",
  passport.authenticate("local-signup", { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user,
    });
  },
);

AuthRouter.post(
  "/login",
  passport.authenticate("local-login", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  },
);

AuthRouter.post("/refresh", (req, res, done) => {
  const { email, refreshToken } = req.body;
  const isValid = VerifyRefresh(email, refreshToken, done);
  if (!isValid) {
    return res.status(401).json({ success: false, error: "Invalid token." });
  }
  const accessToken = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return res.status(200).json({ success: true, accessToken });
});

export default AuthRouter;
