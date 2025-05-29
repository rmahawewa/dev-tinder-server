const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest");

cron.schedule("15 08 * * * ", async () => {
	//this cron job runs every day at 08.15am
	console.log("Hello World, " + new Date());

	try {
		const yesterday = subDays(new Date(), 1);

		const yesterdayStart = startOfDay(yesterday);
		const yesterdayEnd = endOfDay(yesterday);

		const pendingRequests = await ConnectionRequestModel.find({
			status: "interested",
			createdAt: {
				$gte: yesterdayStart,
				$lt: yesterdayEnd,
			},
		}).populate("toUserId", "emailId");

		const listOfEmails = [
			...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
		];

		console.log(listOfEmails);

		for (const email of listOfEmails) {
			// Send Emails
			try {
				const res = await sendEmail.run(
					"New Friend Requests pending for " + email,
					"There are many requests pending, please login to DevTinder and review the requests"
				);
			} catch (err) {
				console.error(err);
			}
		}
	} catch (err) {
		console.error(err);
	}
});
