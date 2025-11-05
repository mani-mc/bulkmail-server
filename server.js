require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Credential = require("./models/Credential");
const EmailHistory = require("./models/EmailHistory");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected Successfully"))
  .catch(() => console.log("Failed to Connect with DB"));

// send email route
app.post("/sendemail", async (req, res) => {
  const { msg, emailList, subject } = req.body;

  try {
    const data = await Credential.find();
    if (!data.length) return res.status(400).send("No credentials found in DB");

    const creds = data[0].toJSON();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: creds.user, pass: creds.pass },
    });

    for (let i = 0; i < emailList.length; i++) {
      await transporter.sendMail({
        from: creds.user,
        to: emailList[i],
        subject,
        text: msg,
      });
    }

    await EmailHistory.create({
      subject,
      msg,
      recipients: emailList,
      status: "success",
    });
    res.send(true);
  } catch (error) {
    console.error("Error sending emails:", error);
    await EmailHistory.create({
      subject,
      msg,
      recipients: req.body.emailList,
      status: "failed",
    });
    res.send(false);
  }
});

// fetch email history
app.get("/emailhistory", async (req, res) => {
  try {
    const history = await EmailHistory.find().sort({ createdAt: -1 });
    res.json(history);
  } catch {
    res.status(500).send("Error fetching history");
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
