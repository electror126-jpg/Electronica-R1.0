const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// Use the port Render assigns, or 3000 locally
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serves the HTML file

// --- EMAIL CONFIGURATION ---
// On Render, set these in "Environment Variables" settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your email address
        pass: process.env.GMAIL_PASS  // Your App Password
    }
});

// --- API ROUTE TO SEND EMAIL ---
app.post('/api/send-email', (req, res) => {
    const { to_email, booker_name, plan, dates, total } = req.body;

    const mailOptions = {
        from: `"Mr. Electronic Admin" <${process.env.GMAIL_USER}>`,
        to: to_email,
        subject: `Booking Confirmed: ${plan}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h2 style="color: #004aad; text-align: center;">Booking Confirmation</h2>
                <p>Dear <strong>${booker_name}</strong>,</p>
                <p>We are pleased to inform you that your training slot has been <strong>confirmed</strong>.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Plan:</strong> ${plan}</p>
                    <p style="margin: 5px 0;"><strong>Dates:</strong> ${dates}</p>
                    <p style="margin: 5px 0; font-size: 1.2em; color: #28a745;"><strong>Total Fee:</strong> ${total}</p>
                </div>

                <p>Please ensure you arrive at the venue by 9:00 AM on the start date.</p>
                <br>
                <p style="font-size: 0.9em; color: #777;">Best Regards,<br>Mr. Electronic Team</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
            return res.status(500).json({ success: false, error: error.toString() });
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
