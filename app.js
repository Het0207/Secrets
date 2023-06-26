//jshint esversion:6
require('dotenv').config()
//create a .env file using touch keyword in terminal 
// we added gitignore and .env here to hide env and to keep our encryption key safe respectively
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const encrypt = require('mongoose-encryption'); // used a new package
const md5 = require("md5");

const mongoose = require("mongoose");


const app = express();

// console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.render("home")
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save();
    res.render("secrets");
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    main().catch((err) => console.log(err));

    async function main() {
        const foundUser = await User.findOne({email:username});
        if(!foundUser){
            console.log("User not found");
        }
        else{
            if(foundUser.password === md5(password)){ // hash value of two same values will be same
                res.render("secrets");
            }
        }
    }


})

app.listen(3000, function (req, res) {
    console.log("Server started at 3000");
})