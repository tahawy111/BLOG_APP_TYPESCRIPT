"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const socket_1 = require("./config/socket");
// Middlewares
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
(0, routes_1.default)(app);
// Socket.io
const http = (0, node_http_1.createServer)(app);
exports.io = new socket_io_1.Server(http, {
    cors: { origin: "*" },
});
exports.io.on("connection", (socket) => (0, socket_1.SocketServer)(socket));
// Mongo Connect
mongoose_1.default.connect(`${process.env.MONGO_URI}`, () => console.log("DB Connected"));
// Server Listenning
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`App Is Listenning At http://localhost:${PORT}`));
