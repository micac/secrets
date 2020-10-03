require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 12;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email:String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password,saltRounds, function(err, hash){

    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if(!err){
        res.render("secrets");
      }
      else{
        console.log(err);
      }
    });
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(!err){
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(error, result){
          if(result){
            res.render("secrets");
          }
          else{
            console.log("Incorrect password");
          }
        });
      }
      else{
        console.log("No user found");
      }
    }
    else{
      console.log(err);
    }
  })
})

app.listen(3000, function(){
  console.log("Server started successfully");
})
