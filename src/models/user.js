const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
	{
		// _id: {
		//     type: Number
		// },
		firstName: {
			type: String,
			required: true,
			minLength: 4,
			maxLength: 50,
			index: true,
		},
		lastName: {
			type: String,
		},
		emailId: {
			type: String,
			lowercase: true,
			required: true,
			unique: true, //unique makes this column an 'index'
			trim: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email address is not valid");
				}
			},
		},
		password: {
			type: String,
			required: true,
			validate(value) {
				if (!validator.isStrongPassword(value)) {
					throw new Error("Please enter a strong password");
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			validate(value) {
				if (!["male", "female", "others"].includes(value)) {
					throw new Error("Gender data is not valid");
				}
			},
		},
		photoUrl: {
			type: String,
			default:
				"https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg",
			validate(value) {
				if (!validator.isURL(value)) {
					throw new Error("Profile photo url is not valid ", value);
				}
			},
		},
		about: {
			type: String,
			default: "This is a default about of the user.",
		},
		skills: {
			type: [String],
		},
	},
	{ timestamps: true }
);

userSchema.methods.getJWT = async function () {
	const user = this;

	const token = await jwt.sign({ _id: user._id }, "DEV@Tinder123", {
		expiresIn: "1d",
	});

	return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
	const user = this;
	const passwordHash = user.password;

	const isValidPassword = await bcrypt.compare(
		passwordInputByUser,
		passwordHash
	);

	return isValidPassword;
};

module.exports = mongoose.model("User", userSchema);
