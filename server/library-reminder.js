const mongoose = require("mongoose"); // library to connect to MongoDB
const nodemailer = require("nodemailer");
const Package = require("./models/package");
require("dotenv").config({ path: `${__dirname}/.env` });

// TODO: factor out from common sendEmail in api.js
const sendEmail = async (mailOptions) => {
  if (!process.env.KERBEROS || !process.env.KERBEROS_PASSWORD) {
    logger.warn("Skipping email send (no credentials provided in environment)");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "outgoing.mit.edu",
    port: 587,
    secure: false,
    auth: {
      user: process.env.KERBEROS,
      pass: process.env.KERBEROS_PASSWORD,
    },
  });

  const result = await transporter.sendMail(mailOptions);
  console.log(result);
};

async function main() {
  mongoose.set("useFindAndModify", false);
  await mongoose.connect(process.env.MONGO_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("DB connected");

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const books = await Package.find({ location: "Library book" });
  const oldBooks = books.filter((book) => book.checkedInTime <= threeDaysAgo);

  if (oldBooks.length > 0) {
    // ugly formatting for are/is and book/books
    const emailText =
      `There ${oldBooks.length > 1 ? "are" : "is"} ${
        oldBooks.length
      } old (checked in more than 3 days ago) library ${
        oldBooks.length > 1 ? "books" : "book"
      } sitting at desk. ` + `Search "library" in the packages list to see them all.`;
    const mailOptions = {
      from: "Maseeh Desk <maseeh-desk@mit.edu>",
      // TODO: change to maseeh_desk@mit.edu
      to: "kburchard1@gmail.com",
      subject: `[Maseeh Desk] Library book reminder`,
      text: emailText,
    };

    await sendEmail(mailOptions);
    console.log("Sent:", emailText);
  }

  console.log("Finished!");
  process.exit(0);
}

main();
