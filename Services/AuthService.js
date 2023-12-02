import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  InsertUserAsync,
  ReadUserByEmailAsync,
} from "../Repositories/AuthRepository.js";

export const CreateUserAsync = async (email, password, done) => {
  try {
    const userExists = await ReadUserByEmailAsync(email);

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
    const user = await ReadUserByEmailAsync(email);
    if (!user) return done(null, false);
    const isMatch = await MatchPassword(password, user.password);
    if (!isMatch) return done(null, false);
    const token = GenerateAccessToken(email);
    const refreshToken = GenerateRefreshToken(email);
    return done(null, {
      id: user.id,
      email: user.email,
      token: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return done(error, false);
  }
};

export const VerifyRefresh = (email, token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    return decoded.email === email;
  } catch (error) {
    return false;
  }
};

export const AuthenticateToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err !== null) console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;
  });

  return await ReadUserByEmailAsync(req.user.email);
};

export const GenerateAccessToken = (email) => {
  return jwt.sign({ email }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

export const GenerateRefreshToken = (email) => {
  return jwt.sign({ email }, process.env.REFRESH_SECRET, {
    expiresIn: "24h",
  });
};

export const MatchPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};
