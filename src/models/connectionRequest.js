const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", //reference to the User collection
			required: true,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ["ignored", "interested", "accepted", "rejected"],
				message: `{VALUE} is an incorrect status type`,
			},
		},
	},
	{ timestamps: true }
);

// ConnectionRequest.find({fromUserId: 554jf568dhfjd4nfsh654, toUserId: 554jf5jgh548trnfsh654})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
	const connectionRequest = this;
	//Check if the fromUserId is same as toUserId
	if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
		throw new Error("Cannot send connection request to yourself!");
	}
	next();
});

const ConnectionRequestModel = new mongoose.model(
	"ConnectionRequest",
	connectionRequestSchema
);

module.exports = ConnectionRequestModel;
