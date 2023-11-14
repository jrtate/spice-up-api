import express, { json } from "express";
import cors from "cors";
import TaskRouter from "./Controllers/TasksController.js";
import UserRouter from "./Controllers/UsersController.js";
import oAuth2Server from "node-oauth2-server";
import TokenService from "./Services/TokenService.js";

// Leverages heroku server assigned port; may change
const PORT = process.env.PORT || 5000;
const corsOptions = { origin: process.env.URL || "*" };

// Setup Express
export const app = express();
const oAuthService = TokenService();
app.oauth = oAuth2Server({
  model: oAuthService,
  grants: ["password"],
  debug: true,
});
app.use(cors(corsOptions));
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(app.oauth.errorHandler());

// Routes
app.use("/auth", UserRouter);
app.use("/tasks", TaskRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
