const express = require("express");
const router = express.Router();

const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

router.post("/contact", (req, res) => {

    const oauth2Client = new OAuth2(
        "938817720546-ufrnqn1ps3gg7qjula80utdhiuk7bjr6.apps.googleusercontent.com", // ClientID
        "XiRkFddCkOOszREpLthRq0Rp", // Client Secret
        "https://developers.google.com/oauthplayground" 
   );

    oauth2Client.setCredentials({
        refresh_token: "1//04D9fLX5KeBlvCgYIARAAGAQSNwF-L9Ir21kOIXdF2C0U8XM6cc3wwZbTyn4C8Cy_KjdieMBCBZlj75DMS60_o-2zvR-wpoOW8NM"
    });
    const accessToken = oauth2Client.getAccessToken();

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
            type: 'OAuth2',
            user: 'merntest1997@gmail.com',
            clientId: '938817720546-ufrnqn1ps3gg7qjula80utdhiuk7bjr6.apps.googleusercontent.com',
            clientSecret: 'XiRkFddCkOOszREpLthRq0Rp',
            refreshToken: '1//04g0o8OFlzE_7CgYIARAAGAQSNwF-L9Irp5VWhjMyRl4Lau02LQrmm8yXVGfwonRKOuqrtX2hfOser8iddpQtbskkIg4fppSa-rc',
            accessToken: accessToken
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    transporter.on('token', token => {
        console.log('A new access token was generated');
        console.log('User: %s', token.user);
        console.log('Access Token: %s', token.accessToken);
        console.log('Expires: %s', new Date(token.expires));
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
