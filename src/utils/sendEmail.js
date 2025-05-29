// snippet-start:[ses.JavaScript.email.sendEmailV3]
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, mbody, subjct) => {
	return new SendEmailCommand({
		Destination: {
			/* required */
			CcAddresses: [
				/* more items */
			],
			ToAddresses: [
				toAddress,
				/* more To-email addresses */
			],
		},
		Message: {
			/* required */
			Body: {
				/* required */
				Html: {
					Charset: "UTF-8",
					Data: "<h1>" + mbody + "</h1>",
				},
				Text: {
					Charset: "UTF-8",
					Data: mbody,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: subjct,
			},
		},
		Source: fromAddress,
		ReplyToAddresses: [
			/* more items */
		],
	});
};

const run = async (subjct, mbody) => {
	const sendEmailCommand = createSendEmailCommand(
		"rmahawewa@yahoo.com",
		"smrdmahawewa@gmail.com",
		mbody,
		subjct
	);

	try {
		return await sesClient.send(sendEmailCommand);
	} catch (caught) {
		if (caught instanceof Error && caught.name === "MessageRejected") {
			/** @type { import('@aws-sdk/client-ses').MessageRejected} */
			const messageRejectedError = caught;
			return messageRejectedError;
		}
		throw caught;
	}
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
