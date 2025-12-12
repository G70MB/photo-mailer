require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/sendphoto', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) return res.status(400).send('No image sent');

    const base64 = image.split(";base64,").pop();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: "Captured Photo",
      text: "Photo captured from the website",
      attachments: [
        {
          filename: "photo.png",
          content: base64,
          encoding: "base64",
        },
      ],
    });

    // res.send("Mail sent successfully!");
  } catch (error) {
    res.status(500).send("Error sending email: " + error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
