
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// CONNECT TO DATABASE
const uri = "mongodb://localhost:27017/userDB";
mongoose.set('strictQuery', false);
mongoose.connect(uri, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully connected to DB");
    }
});

// CREATE NEW DATABASE SCHEMA
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt , { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

// TO DO
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});


// CREATE NEW USER
app.post("/register", (req, res) => {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save( (err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

});

// LOGIN CHECK USER AVAILABLE
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
 
    User.findOne({email: username}, function(err, result){
        
        if (err) {
            console.log(err);
        } else {

            console.log(result.password + "  " + password);

            if (result) {
                if (result.password === password) {
                    res.render("secrets");
                }
            } 
        }
    });
});



// SERVER RUNNING
app.listen("3000", () => {
    console.log("Server started on port 3000");
});