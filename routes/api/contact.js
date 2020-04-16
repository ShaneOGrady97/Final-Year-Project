const express = require("express");
const router = express.Router();

//const nodemailer = require('nodemailer')

const nodeoutlook = require('nodejs-nodemailer-outlook');

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
	
	nodeoutlook.sendEmail({
    auth: {
        user: "cointrack-app@outlook.com",
        pass: "merntest1997!"
    },
    from: 'cointrack-app@outlook.com',
    to: 'merntechinfo@gmail.com', //password same as cointrack-app@outlook.com
    subject: 'Sending Email using Node.js[nodemailer]',
    html: output,
    onError: (e) => console.log(e),
    onSuccess: (i) => res.json({success:true,}),
	});
});


module.exports = router;
