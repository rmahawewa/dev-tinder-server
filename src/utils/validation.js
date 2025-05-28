const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateSignUpData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;

	if (!firstName || !lastName) {
		throw new Error("Name is not valid");
	} else if (firstName.length < 4 || firstName.length > 50) {
		throw new Error("First name shoud be 4-50 charactors long");
	} else if (!validator.isEmail(emailId)) {
		throw new Error("The email id is not valid");
	} else if (!validator.isStrongPassword(password)) {
		throw new Error("Please enter a strong password");
	}
};

const validateLoginData = (req) => {
	const { emailId, password } = req.body;

	if (!validator.isEmail(emailId)) {
		throw new Error("The email is is not valid");
	} else if (!validator.isStrongPassword(password)) {
		throw new Error("Password is not valid");
	}
};

const validateEditProfileData = (req) => {
	const allowedEditFields = [
		"firstName",
		"lastName",
		"emailId",
		"photoUrl",
		"gender",
		"age",
		"about",
		"skills",
	];

	const isEditAllowed = Object.keys(req.body).every((field) =>
		allowedEditFields.includes(field)
	);
	return isEditAllowed;
};

const validatePassword = async (req) => {
	const user = req.user;
	const oldPassword = req.body.oldPassword;
	let message = "";
	const isValidPassword = await user.validatePassword(oldPassword);
	if (!isValidPassword) {
		message = "Old password is incorrect";
		return message;
	}
	const newPassword = req.body.newPassword;
	if (!validator.isStrongPassword(newPassword)) {
		message = "Please enter an strong password";
		return message;
	}
	message = "Proceed";
	return message;
};

module.exports = {
	validateSignUpData,
	validateLoginData,
	validateEditProfileData,
	validatePassword,
};
