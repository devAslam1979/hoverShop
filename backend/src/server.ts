import express, { Request, Response } from "express";
import productsRouter from "./routes/products";
import userRouter from "./routes/users";
import errorHandler from "./middlewares/errorHandler";
import authRouter from "./routes/authRoutes";
import connectDB from "./config/db";
import dotenv from "dotenv";

//load env variables
dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT ?? 8000;
app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World latest");
});

//routes
app.use("/api/products", productsRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use(errorHandler);

app.listen(port, () => {
  //connect to database
  connectDB();
  console.log("Server running on port 8000");
});
