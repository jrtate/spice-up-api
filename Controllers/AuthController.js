import LocalStrategy from "passport-local";
import passport from "passport";
import express from "express";
import {
  AuthenticateUserAsync,
  CreateUserAsync,
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

export default AuthRouter;
