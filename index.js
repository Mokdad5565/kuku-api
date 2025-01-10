import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
const sendmail = (req, res, next) => {
  try {
    // Process the email submission and send it
    sendEmail(req.query)
      .then((response) => {
        res.status(200).json({
          message:
            "Thank you for your submission! We have received your details.",
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).json({
          success: false,
          description: "There was an error while sending your submission.",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      description: "Server Error",
    });
  }
};
router.get("/site", sendmail);
app.use("/api/v1", router);
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.Email,
    pass: process.env.Password,
  },
});
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP is configured correctly!");
  }
});
function sendEmail(submissionDetails) {
  return new Promise((resolve, reject) => {
    const mail_configs = {
      from: process.env.Email,
      to: process.env.Email_To,
      subject: "New Submission Received - Kuku",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>New Submission Notification</title>
      </head>
      <body>
        <div style="font-family: Helvetica, Arial, sans-serif; min-width:1000px; overflow:auto; line-height:2">
          <div style="margin:50px auto; width:70%; padding:20px 0">
           
            <p style="font-size:1.1em">Hi,</p>
            <p>We have received a new submission from Kuku. Below are the details:</p>
            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Full Name:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date of Birth:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.dob}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone Number:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">email:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Food Rating:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.food}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service Rating:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.service}</td>
              </tr>
               <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mood Rating:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.mood}</td>
              </tr> <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Cleanliness Rating:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.cleanliness}</td>
              </tr>
               <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Comments:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${submissionDetails.comments}</td>
              </tr>
            </table>
           
            <hr style="border:none; border-top:1px solid #eee" />
            <div style="float:right; padding:8px 0; color:#aaa; font-size:0.8em; line-height:1; font-weight:300">
              <p>Kuku</p>
              <p>Beirut</p>
              <p>Lebanon</p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}
app.listen(8800, () => {
  console.log("Running on port 8800");
});
