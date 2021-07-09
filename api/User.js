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
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else if(!/^[a-zA-Z ]+$/.test(name)){
        res.json({
            status: 'FAILED',
            message: "Invalid name entered"
        })
    } else if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        res.json({
            status: 'FAILED',
            message: "Invalid email entered"
        })
    } else if(!(new Date(dateOfBirth).getTime())) {
        res.json({
            status: 'FAILED',
            message: "Invalid date of birth entered"
        })  
    } else if(password.length < 8){
        res.json({
            status: 'FAILED',
            message: "Passwor is too short!"
        })  
    } else {
        User.find({email}).then(result => {
            if(result.length){
                res.json({
                    status: "FAILED",
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
                            status: "SUCCESS",
                            message: "Signup successful",
                            data: result
                        });
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user account!"
                        })
                    })
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password!"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking existing user!"
            })
        })
    }
});

//Sign in 
router.post('/signin', (req, res) => {

});

module.exports = router;