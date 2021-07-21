import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()

export default nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_MAIL,
    pass: process.env.GMAIL_PASSWORD
  }
})
