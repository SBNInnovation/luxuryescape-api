import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service
    auth: {
      user: process.env.EMAIL as string,
      pass: process.env.PASSWORD as string,
    },
  });
  
  export function sendOtpEmail(to: string, otp: string) {
    const mailOptions = {
      from:`LUX <${process.env.EMAIL as string}>`,
      to: to,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
  
  export function generateOtp(length: number): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }