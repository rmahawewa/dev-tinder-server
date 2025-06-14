const express = require("express");
const connectDB = require("./config/database.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
require("./utils/cronjob.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const initializeSocket = require("./utils/socket.js");
const chatRouter = require("./routes/chat.js");

const app = express();

const corsOptions = { origin: "http://localhost:5173", credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
	.then(() => {
		console.log("Database connection established");
		server.listen(process.env.PORT, () => {
			console.log("Server is successfully listening on port 7777 ...");
		});
	})
	.catch((err) => {
		console.error(err.message);
	});
