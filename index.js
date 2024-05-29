require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Constants
const EMAIL_SEND_DELAY_MS = 30000;
const EMAIL_SUBJECT = 'D/O request';
const FROM_EMAIL = process.env.USER_MAIL;
const TO_EMAIL = process.env.RECEIVER_MAIL;
const DIRECTORY_PATH = 'E:\\TestMails\\docs';


// Create a transporter using environment variables
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: FROM_EMAIL,
    pass: process.env.USER_PASS
  }
});
counter = 0
// Function to send an email with an attachment
function sendEmailWithAttachment(filePath, deliveryInstructions) {
  return new Promise((resolve, reject) => {
    const mailDetails = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: EMAIL_SUBJECT,
      text: deliveryInstructions,
      attachments: [
        {
          filename: path.basename(filePath),
          path: filePath
        }
      ]
    };

    mailTransporter.sendMail(mailDetails, (err, data) => {
      if (err) {
        console.error(`Error sending email for file ${filePath}:`, err);
        reject(err);
      } else {
        counter++;
        console.log(`Email sent successfully for file ${filePath}`, counter);
        resolve(data);
      }
    });
  });
}

// Function to shuffle array elements randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to get random delivery instruction
function getRandomDeliveryInstruction() {
  const deliveryInstructionsPool = [
    'D/O', 
    'D/O request', 
    'Delivery Order', 
    'Delivery Instruction',
    'Please find the attached delivery order for your review.',
    'Kindly review the attached delivery order.',
    'Attached is the delivery order for your reference.',
    'Please review the delivery order attached here.',
    'For your attention, the delivery order is attached.'
  ];

  const shuffledPool = shuffleArray(deliveryInstructionsPool);
  return shuffledPool[0];
}



// Read files from the directory and send them one by one with a 35-second delay
fs.readdir(DIRECTORY_PATH, async (err, files) => {
  if (err) {
    return console.error('Unable to scan directory:', err);
  }

  const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
  console.log('total pdf',pdfFiles.length)
  for (let i = 0; i < pdfFiles.length; i++) {
    const filePath = path.join(DIRECTORY_PATH, pdfFiles[i]);
    const deliveryInstruction = getRandomDeliveryInstruction();

    try {
      await sendEmailWithAttachment(filePath, deliveryInstruction);
      console.log(`Waiting for ${EMAIL_SEND_DELAY_MS / 1000} seconds before sending the next email...`);
      await new Promise(resolve => setTimeout(resolve, EMAIL_SEND_DELAY_MS)); // second delay
    } catch (error) {
      console.error('An error occurred while sending emails:', error);
    }
  }
});

