import {
  InsertUserAsync,
  ValidateEmailExistsAsync,
} from "../Repositories/AuthRepository.js";
import bcrypt from "bcryptjs";

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
    return done(null, { id: user.id, email: user.email });
  } catch (error) {
    return done(error, false);
  }
};

export const MatchPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};
