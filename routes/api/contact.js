const express = require("express");
const router = express.Router();

const nodemailer = require('nodemailer');

router.post("/contact", (req, res) => {

    const output = 
    `<p>You have a new contact request</p>
    <h3>Contact Details</h3>

    <br />
      
    <h4>Name: <span> ${req.body.name} </span> </h4>
    <h4>Email: <span> ${req.body.email} </span> </h4>
    <h4>Message:  </h4> 
    <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        host: 'smtp.gmail.com',
        auth: {
            user: 'merntest1997@gmail.com',
            pass: 'merntest1997!'
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    let mailOptions = {
        from: '"Nodemailer Contact" <cointrack-app.herokuapp.com>',
        to: 'merntechinfo@gmail.com', //password same as merntest1997@gmail.com
        subject: 'Sending Email using Node.js[nodemailer]',
        html: output // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.json({
                success: true,
            });
        }
    });  
});


module.exports = router;
