import express, { Request, Response } from "express";
import productsRouter from "./routes/products";
import userRouter from "./routes/users";
import errorHandler from "./middlewares/errorHandler";
import authRouter from "./routes/authRoutes";
import connectDB from "./config/db";
import dotenv from "dotenv";

//load env variables
dotenv.config();

//connect to database
connectDB();
const app = express();
app.use(express.json());

const port = process.env.PORT ?? 8000;
app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World latest");
});

//routes
app.use("/api/products", productsRouter);
app.use("/api/users", userRouter);
app.use(errorHandler);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log("Server running on port 8000");
});
