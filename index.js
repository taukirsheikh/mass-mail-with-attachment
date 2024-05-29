const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Constants
const EMAIL_SEND_DELAY_MS = 30000;
const EMAIL_SUBJECT = 'D/O request';
const FROM_EMAIL = process.env.USER_MAIL;
const TO_EMAIL = process.env.RECEIVER_MAIL;
const DIRECTORY_PATH = 'E:\\TestMails\\docs';
const PDF_EXTENSION = '.pdf';

// Create transporter
const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS // Replace with your actual email password or use environment variables
  }
});

// Function to send email with attachment
function sendEmailWithAttachment(filePath, deliveryInstructions, callback) {
  const mailDetails = {
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: EMAIL_SUBJECT,
    text: deliveryInstructions,
    attachments: [{ filename: path.basename(filePath), path: filePath }]
  };

  mailTransporter.sendMail(mailDetails, function(err, data) {
    if (err) {
      console.log(`Error sending email for file ${filePath}:`, err);
    } else {
      console.log(`Email sent successfully for file ${filePath}`);
    }
    if (callback) callback();
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

// Function to send emails with attachments from a directory
function sendEmailsWithAttachments(files) {
  function sendEmail(index) {
    if (index < files.length) {
      const filePath = path.join(DIRECTORY_PATH, files[index]);
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
      const selectedInstruction = shuffleArray(deliveryInstructionsPool)[0];
      
      sendEmailWithAttachment(filePath, selectedInstruction, () => {
        setTimeout(() => {
          sendEmail(index + 1);
        }, EMAIL_SEND_DELAY_MS);
      });
    }
  }
  
  sendEmail(0);
}
// Read files from the directory and send them with delay
fs.readdir(DIRECTORY_PATH, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory:', err);
  }

  const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === PDF_EXTENSION);
  sendEmailsWithAttachments(pdfFiles);
});

