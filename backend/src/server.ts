import Express, { Request, Response } from "express";
import productsRouter from "./routes/products";
import userRouter from "./routes/users";
const env = require("dotenv");
const app = Express();

const port = process.env.PORT ?? 8000;
app.get("/", async (req:Request, res:Response)=>{
   res.send("Hello World latest");
})

app.use("/api/products", productsRouter);
app.use("/api/users", userRouter);

app.listen(port, ()=>{
    console.log("Server running on port 8000");
})