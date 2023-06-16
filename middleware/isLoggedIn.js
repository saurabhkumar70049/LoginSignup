import express from "express";
import mongoose from "mongoose";
const user = mongoose.model("User");


const isLoggedIn = async(req, res, next) => {
    let token = req.headers.authorization;
    console.log(token);
    // token = token.split(" ")[1];
    // token = token.replace("Bearer ", "");
    try {
        let foundUser = await user.findOne({token:token});
        if(!foundUser) {
            return res.send({error: "User not found"});
        }
        req.user = foundUser; //what is meaning of this line
        next();
    }
    catch(err) {
        console.log("Token is invalid ", err);
        return res.send({error:"Token is invalid"});
    }
}

export default isLoggedIn;