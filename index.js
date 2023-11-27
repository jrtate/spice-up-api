import express, { json } from "express";
import cors from "cors";
import AuthRouter from "./Controllers/AuthController.js";
import TaskRouter from "./Controllers/TasksController.js";
import OrderRouter from "./Controllers/OrderController.js";
import TaskCompletionRouter from "./Controllers/TaskCompletionController.js";
import dotenv from "dotenv";
import GoalsRouter from "./Controllers/GoalsController.js";
import SubGoalsRouter from "./Controllers/SubGoalsController.js";

// Leverages heroku server assigned port; may change
const PORT = process.env.PORT || 5000;
const corsOptions = { origin: process.env.URL || "*" };

// Setup config vars
dotenv.config();

// Setup Express
export const app = express();
app.use(cors(corsOptions));
app.use(json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", AuthRouter);
app.use("/goals", GoalsRouter);
app.use("/sub-goals", SubGoalsRouter);
app.use("/tasks", TaskRouter);
app.use("/task-completion", TaskCompletionRouter);
app.use("/order", OrderRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
