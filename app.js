//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose");
const { FindOperators } = require("mongodb");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
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
        password: req.body.password
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
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }


})

app.listen(3000, function (req, res) {
    console.log("Server started at 3000");
})