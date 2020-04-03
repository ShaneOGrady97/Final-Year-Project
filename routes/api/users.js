const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const nodemailer = require('nodemailer');

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// Assign a random colour to user avatar
const colours = ["#FF0000", "#008000", "#008080", "#808000",
 "#0000FF", "#000080", "#FF00FF", "#800000", "#C0C0C0"];
const colourRandom = () =>  colours[Math.floor(Math.random() * colours.length)];


// @route POST api/users/confirmation
// @desc Verify email address 
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Validation checks
  if (!isValid) {
    return res.status(400).json(errors);
  }


  // Check if email exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email exists";
      return res.status(400).json(errors);
    }   else {
      // Check is username exists
      User.findOne({ name: req.body.name }).then(user => {
        if (user) {
          errors.name = "Username exists";
          return res.status(400).json(errors);
        } // Otherwise created new user
        else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            colour: colourRandom(),
          });
    
          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
          });
          
          // After user is created we will send a verification email to that user 
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'merntest1997@gmail.com',
                pass: 'merntest1997!'
            },
            tls: {
                rejectUnauthorized: false
            },
          });
    
          const payload = {
            id: newUser.id,
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 2630000 // 1 month in seconds
            },
            (err, emailToken) => {
              // production environment
              const url = `https://cointrack-app.herokuapp.com/api/users/confirmation/${emailToken}`;

              // development environment
              //const url = `http://localhost:5000/api/users/confirmation/${emailToken}`;


              let mailOptions = {
                from: '"Cointrack" <cointrack-app.herokuapp.com>',
                to: newUser.email,
                subject: 'Confirm Email',
                html: `Please click this link to confirm your email: <br/> <a href="${url}">${url}</a>`
              };

              transporter.sendMail(mailOptions, error => {
                if (error) {
                    console.log(error);
                } else {
                    res.json({
                        success: true,
                    });
                }
              });  
            }
          );

        }
      });
    }
  });
    

});

// Verify the JWT to enable the user to login
router.get('/confirmation/:token', (req, res) => {
  try {
    //jwt.verify(req.params.token, keys.secretOrKey);
    const verify = jwt.verify(req.params.token, keys.secretOrKey);
    const id = verify.id;

    User.findById(id).then(user => {    
      user.active = true
      user.save()
    });

    // production environment
    return res.redirect('https://cointrack-app.herokuapp.com/login');

    // development environment
    //return res.redirect('http://localhost:3000/login');

  } catch (e) {
    res.json({
      jwt: 'expired'
    })
  }

});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    if (!user.active) {
      return res.status(404).json({ emailnotfound: "Email activation required" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          colour: user.colour
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
