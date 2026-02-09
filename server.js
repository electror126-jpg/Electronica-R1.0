const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serves the HTML file

// --- EMAIL CONFIGURATION ---
// REPLACE THESE VALUES WITH YOUR REAL EMAIL DETAILS
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use 'outlook', 'yahoo', or generic SMTP
    auth: {
        user: 'electror126@gmail.com', 
        pass: 'bgdw gxgn udnn oaod' // NOTE: Generate an "App Password" in Gmail settings, don't use your login password
    }
});

// --- API ROUTE TO SEND EMAIL ---
app.post('/api/send-email', (req, res) => {
    const { to_email, booker_name, plan, dates, total } = req.body;

    const mailOptions = {
        from: '"Mr. Electronic Admin" <no-reply@mr-electronic.com>',
        to: to_email,
        subject: `Booking Confirmed: ${plan}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #004aad;">Booking Confirmation</h2>
                <p>Dear <strong>${booker_name}</strong>,</p>
                <p>We are pleased to inform you that the admin has <strong>accepted</strong> your booking request.</p>
                <hr>
                <p><strong>Plan:</strong> ${plan}</p>
                <p><strong>Dates:</strong> ${dates}</p>
                <p><strong>Total Fee:</strong> ${total}</p>
                <hr>
                <p>Please arrive at the venue on the starting date at 9:00 AM.</p>
                <br>
                <p>Best Regards,<br>Mr. Electronic Team</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, error: error.toString() });
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});