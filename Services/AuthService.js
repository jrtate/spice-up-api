import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  InsertUserAsync,
  ValidateEmailExistsAsync,
} from "../Repositories/AuthRepository.js";

export const CreateUserAsync = async (email, password, done) => {
  try {
    const userExists = await ValidateEmailExistsAsync(email);

    if (userExists) {
      return done(null, false);
    }

    const user = await InsertUserAsync(email, password);
    return done(null, user);
  } catch (error) {
    done(error);
  }
};

export const AuthenticateUserAsync = async (email, password, done) => {
  try {
    const user = await ValidateEmailExistsAsync(email);
    if (!user) return done(null, false);
    const isMatch = await MatchPassword(password, user.password);
    if (!isMatch) return done(null, false);
    const token = GenerateAccessToken(email);
    return done(null, { id: user.id, email: user.email, token: token });
  } catch (error) {
    return done(error, false);
  }
};

export const AuthenticateToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;
  });
};

export const GenerateAccessToken = (username) => {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

export const MatchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};
