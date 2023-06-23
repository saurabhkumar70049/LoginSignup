import express from "express";
import mongoose from "mongoose";
const user = mongoose.model("User");
import "dotenv/config";
import jwt from "jsonwebtoken";


const isLoggedIn = async(req, res, next) => {
    let token = req.headers.authorization;
    if(!token) {
        return res.send({error:"you must be logged in"});
    }
    
    token = token.split(" ")[1];
    // token = token.replace("Bearer ", "");
    try {
        let _id;
        jwt.verify(token, process.env.JSON_SECRET_KEY, (err, payload)=> {
            if(err){
                console.log("Token error", err.message);
                return res.send({error:err.message})
            }
            _id = payload._id;
        })

        let foundUser = await user.findOne({_id:payload._id});
        req.user = foundUser;
        console.log(foundUser);
        next()


        // let foundUser = await user.findOne({token:token});
        // if(!foundUser) {
        //     return res.send({error: "User not found"});
        // }
        // req.java = foundUser; //This means that the user object is attached to the req object, allowing subsequent middleware or route handlers to access and use the user's information.
        // next();
    }
    catch(err) {
        console.log("Token is invalid ", err);
        return res.send({error:"Token is invalid"});
    }
}

export default isLoggedIn;