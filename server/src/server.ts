import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import { SocketServer } from "./config/socket";

// Middlewares
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
routes(app);

// Socket.io
const http = createServer(app);
export const io = new Server(http, {
  cors: { origin: "*" },
});
io.on("connection", (socket: Socket) => SocketServer(socket));

// Mongo Connect
mongoose.connect(`${process.env.MONGO_URI}`, (): void =>
  console.log("DB Connected")
);

// Server Listenning
const PORT = process.env.PORT || 5000;
http.listen(PORT, () =>
  console.log(`App Is Listenning At http://localhost:${PORT}`)
);
