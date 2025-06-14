const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequests = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: "interested",
		}).populate("fromUserId", USER_SAFE_DATA);

		res.json({
			message: "Data fetched successfully",
			data: connectionRequests,
		});
	} catch (err) {
		res.status(400).send("Error: " + err.message);
	}
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequests = await ConnectionRequest.find({
			status: "accepted",
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		})
			.populate("fromUserId", USER_SAFE_DATA)
			.populate("toUserId", USER_SAFE_DATA);

		const data = connectionRequests.map((row) => {
			if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
				return row.toUserId;
			} else {
				return row.fromUserId;
			}
		});

		res.json({ message: "All the connections", data: data });
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

userRouter.get("/feed", userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;

		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		limit = limit > 50 ? 50 : limit;
		const skip = (page - 1) * limit;

		const connectionRequests = await ConnectionRequest.find({
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		}).select("fromUserId toUserId");

		console.log("connection requests: " + connectionRequests);

		const hiddenUsersFromField = new Set();
		connectionRequests.forEach((req) => {
			hiddenUsersFromField.add(req.fromUserId);
			hiddenUsersFromField.add(req.toUserId);
		});

		console.log("Hidden from field: " + hiddenUsersFromField);

		const users = await User.find({
			$and: [
				{ _id: { $nin: Array.from(hiddenUsersFromField) } },
				{ _id: { $ne: loggedInUser._id } },
			],
		})
			.select(USER_SAFE_DATA)
			.skip(skip)
			.limit(limit);

		res.send(users);
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

userRouter.get("/chatUser/:chatUserId", userAuth, async (req, res) => {
	try {
		const chatUserId = req.params.chatUserId;
		let chatUser = await User.findById({ _id: chatUserId }).select(
			"firstName lastName"
		);
		console.log("chat user" + chatUser);
		res.send(chatUser);
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

module.exports = userRouter;
