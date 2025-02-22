import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export function sendPasswordToEmail(
  username: string,
  email: string,
  password: string
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Created",
    text: `Your account has been created. Password of this username : "${username}" is "${password}"`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error("Failed to send email " + error.message);
    }
    return info;
  });
}
