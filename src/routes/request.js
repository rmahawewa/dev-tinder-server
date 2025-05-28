const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
const sendEmail = require("../utils/sendEmail.js");

requestRouter.post(
	"/request/send/:status/:toUserId",
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status;

			const allowedStatus = ["ignored", "interested"];
			if (!allowedStatus.includes(status)) {
				return res
					.status(400)
					.json({ message: "Invalid status type: " + status });
			}

			const toUser = await User.findById(toUserId);
			if (!toUser) {
				return res.status(400).json({ message: "User not found!" });
			}

			const existingConnectionRequest = await ConnectionRequest.findOne({
				$or: [
					{ fromUserId: fromUserId, toUserId: toUserId },
					{ fromUserId: toUserId, toUserId: fromUserId },
				],
			});

			if (existingConnectionRequest) {
				return res
					.status(400)
					.send({ message: "Connection Request already exists!!!" });
			}

			const connectionRequest = new ConnectionRequest({
				fromUserId,
				toUserId,
				status,
			});

			const data = await connectionRequest.save();
			console.log("test email");
			const emailRes = await sendEmail.run();
			console.log(emailRes);

			res.json({
				message: "Connection Request Sent Successfully!",
				data,
			});
		} catch (err) {
			res.status(400).send("ERROR: " + err.message);
		}
	}
);

requestRouter.post(
	"/request/review/:status/:requestId",
	userAuth,
	async (req, res) => {
		// Validate the status: status must be 'interested'
		// LoggedInId == toUserId
		// Request Id should be valid
		try {
			const loggedInUser = req.user;
			const allowedStatus = ["accepted", "rejected"];
			const { status, requestId } = req.params;
			if (!allowedStatus.includes(status)) {
				return res.status(400).json({ message: "Status is not valid" });
			}
			const connectionRequest = await ConnectionRequest.findOne({
				_id: requestId,
				toUserId: loggedInUser._id,
				status: "interested",
			});
			if (!connectionRequest) {
				return res
					.status(404)
					.json({ message: "Connection Request not found" });
			}
			connectionRequest.status = status;
			const data = await connectionRequest.save();
			res.json({ message: "Connection request " + status, data });
		} catch (err) {
			res.status(400).send("ERROR: " + err.message);
		}
	}
);

module.exports = requestRouter;
