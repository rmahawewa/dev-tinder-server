const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
	try {
		// Read the token from the req cookies

		const { token } = req.cookies;
		if (!token) {
			return res.status(401).send("The user is not authorized");
		}

		// Validate the token

		const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);

		// Find the user

		const { _id } = decodeObj;

		const user = await User.findById({ _id: _id });
		if (!user) {
			throw new Error("User is not found");
		}
		req.user = user;
		next();
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
};

module.exports = {
	userAuth,
};
