const express = require("express");
const authRouter = express.Router();
const {
	validateSignUpData,
	validateLoginData,
} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
	try {
		// Validation of data
		validateSignUpData(req);

		//Encrypting password
		const { firstName, lastName, emailId, password } = req.body;
		const passwordHash = await bcrypt.hash(password, 10);
		console.log(passwordHash);

		// if(!validator.isEmail(req.body.emailId)){
		//     throw new Error("Email is not valid");
		// }
		if (req.body.skills?.length > 10) {
			throw new Error("Skills count can not exeed ten");
		}
		const user = new User({
			firstName,
			lastName,
			emailId,
			password: passwordHash,
		});
		const savedUser = await user.save();

		// Create a JWT Token
		const token = await savedUser.getJWT();

		//Add the token to the cookie and send the response back to the user
		res.cookie("token", token, {
			expires: new Date(Date.now() + 7 * 24 * 3600000),
		});

		res.json({ message: "User added successfully", data: savedUser });
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

authRouter.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;
		// Validation of data
		validateLoginData(req);

		const user = await User.findOne({ emailId: emailId });
		if (!user) {
			throw new Error("Invalid credencials");
		}

		const isValidPassword = await user.validatePassword(password);
		if (isValidPassword) {
			// Create a JWT Token
			const token = await user.getJWT();

			//Add the token to the cookie and send the response back to the user
			res.cookie("token", token, {
				expires: new Date(Date.now() + 7 * 24 * 3600000),
			});

			res.json({ data: user });
		} else {
			throw new Error("Invalid credencials");
		}
	} catch (err) {
		res.status(400).send("ERROR: " + err.message);
	}
});

authRouter.post("/logout", async (req, res) => {
	res
		.cookie("token", null, { expires: new Date(Date.now()) })
		.send("Logout successfull");

	// OR
	// res.send();
});

module.exports = authRouter;
