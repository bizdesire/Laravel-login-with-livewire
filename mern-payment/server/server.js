import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from 'cors';
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import { handleWebhookEvent } from "./helper/webhookHandler.js";
import routes from "./routes/index.js";
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.post("/webhook", express.raw({type: 'application/json'}), handleWebhookEvent); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api", routes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "dist", "index.html")));
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
