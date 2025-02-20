import Express, { Request, Response } from "express";
import productsRouter from "./routes/products";
import userRouter from "./routes/users";
import errorHandler from "./middlewares/errorHandler";

const app = Express();
// const cors = require("cors");
// app.use(cors());

app.use(Express.json()); //Will only use JSON as req body format not as form

const port = process.env.PORT ?? 8000;
app.get("/", async (req:Request, res:Response)=>{
    res.send("Hello World latest");
})

app.use("/api/products", productsRouter);
app.use("/api/users", userRouter);
app.use(errorHandler);

app.listen(port, ()=>{
    console.log("Server running on port 8000");
})