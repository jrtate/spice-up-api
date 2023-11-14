import { IsValidUser, Register } from "../Repositories/UserRepository.js";

export const RegisterUser = async (req, res) => {
  if (!(await IsValidUser(req.body.username))) {
    return res.status(400).json({ error: "User already exists" });
  } else {
    await Register(req.body.username, req.body.password);
    return res.status(200);
  }
};

export const Login = (query, res) => {};
