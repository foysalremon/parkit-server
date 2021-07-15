const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcrypt');

//Sign Up
router.post('/signup', (req, res) => {
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if(name == '' || email == '' || password == '' || dateOfBirth == ''){
        res.json({
            status: "FAILED", //TODO: Proper coded status
            message: "Empty input fields!"
        })
    } else if(!/^[a-zA-Z ]+$/.test(name)){
        res.json({
            status: 'FAILED', //TODO: Proper coded status
            message: "Invalid name entered"
        })
    } else if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        res.json({
            status: 'FAILED', //TODO: Proper coded status
            message: "Invalid email entered"
        })
    } else if(!(new Date(dateOfBirth).getTime())) {
        res.json({
            status: 'FAILED', //TODO: Proper coded status
            message: "Invalid date of birth entered"
        })  
    } else if(password.length < 8){
        res.json({
            status: 'FAILED', //TODO: Proper coded status
            message: "Passwor is too short!"
        })  
    } else {
        User.find({email}).then(result => {
            if(result.length){
                res.json({
                    status: "FAILED", //TODO: Proper coded status
                    message: "User with the provided email already exist"
                })
            } else {
                //password handing
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email, 
                        password: hashedPassword,
                        dateOfBirth
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS", //TODO: Proper coded status
                            message: "Signup successful",
                            data: result
                        });
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED", //TODO: Proper coded status
                            message: "An error occured while saving user account!"
                        })
                    })
                })
                .catch(err => {
                    res.json({
                        status: "FAILED", //TODO: Proper coded status
                        message: "An error occured while hashing password!"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED", //TODO: Proper coded status
                message: "An error occured while checking existing user!"
            })
        })
    }
});

//Sign in 
router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    
    if(email == '' || password == ''){
        res.json({
            status: "FAILED", //TODO: Proper coded status
            message: "Empty credentials supplied"
        })
    } else {
        User.find({email})
        .then(data => {
            if(data.length){
               const hashedPassword = data[0].password;
               bcrypt.compare(password, hashedPassword).then(result => {
                   if(result){
                       res.json({
                           status: "SUCCESS", //TODO: Proper coded status
                           message: "Signin successful",
                           data: data
                       })
                   } else {
                       res.json({
                           status: "FAILED", //TODO: Proper coded status
                           message: "Invalid password entered"
                       })
                   }
               })
               .catch(err => {
                   res.json({
                       status: "FAILED", //TODO: Proper coded status
                       message: "An error occured while signing in"
                   })
               })
            } else {
                res.json({
                    status: "FAILED", //TODO: Proper coded status
                    message: "Invalid credentials entered!" 
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED", //TODO: Proper coded status
                message: "An error occured while checking for existging user"
            })
        })
    }
});

module.exports = router;
