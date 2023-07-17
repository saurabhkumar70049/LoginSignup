import express from "express";
import mongoose from "mongoose";
import {v4 as uuid4} from "uuid"; // here we use uuid to generate token and "as" is stand for alice and it is use refference the any object and any thing
import bcrypt from "bcrypt"; //it is use for encript and decript the data 
const authRouter = express.Router();
const user = mongoose.model("User");
import isLoggedIn from "../middleware/isLoggedIn.js";
import jwt from "jsonwebtoken";
import 'dotenv/config'; //ES5 way to write require('doteven').config


//access 
console.log("secret", process.env.JSON_SECRET_KEY.length);

authRouter.post('/signup', (req, res)=> {

    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.send({error:"Please add alll the fields"});
    }

    //email not repeated

    user.findOne({email: email})
    .then(
        (savedUser)=> {
            if(savedUser){
                return res.send({error : "User already exists with that email"})
            }

            //password hashing || encription

            bcrypt.hash(password, 10)
            .then((hashedPassword)=>{
                let newUser = new user({
                    name: name,
                    email: email,
                    password: hashedPassword
                })
            
                newUser.save()  // async in nature
                .then((savedUser)=>{
                    if(!savedUser){
                        return res.send({erro:"User not save"});
                    }
                    return res.send({success: true, message: "User saved successfully", data: savedUser})
                })
                .catch(err => console.log(err))
                }
            )



    })
    .catch(err=> {
        console.log(err);
    })
    
})


authRouter.post('/login', (req, res)=> {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.send({error : "Please add all the fields"});
    }

    //email validation //regex

    user.findOne({email: email})
        .then((foundUser) =>{
            // console.log("foundUser : " , foundUser);
            if(foundUser == null) {
                return res.send({error : "User not Found"});
            }
            bcrypt.compare(password, foundUser.password)
            .then((result)=> {
                if(result == false) {
                    return res.send('Invalid password');
                }

                //generate token
                const token = jwt.sign({_id:foundUser._id}, process.env.JSON_SECRET_KEY, {expiresIn: "1h"});
                
                // jwt.verify(token, process.env.JSON_SECRET_KEY)
                return res.send({success: true, message: "User logged in successfully", data: foundUser, token:token});
                
                
                
                //genetate token
            
                // let token = uuid4();
                // foundUser.token = token;
                // foundUser.save()
                // .then((savedUser)=> {
                //     return res.send({success: true, message: "User logged in successfully", data: savedUser});
                // })

                // .catch(err => console.log("issue while saving token in database ", err));
            })
    })
    .catch(err=> {
        console.log(err=> {
            console.log("issue while searching email in database", err);
        })
    })

})

authRouter.get("/secret1", isLoggedIn, (req, res)=> {
    return res.send({success: true, message: "You are authorized to be a raw agent", loggedInAgentDetails : req.user});
})

authRouter.delete("/logout", isLoggedIn, async(req, res)=> {
    req.user.token = null;
    try{
        let savedUser = await req.user.save();
        return res.send({success:true, message:"User logged out succefully", data: savedUser});
    }
    catch(err) {
        console.log("logout failed", err);
    }
})

//token :- A random set of letters

export default authRouter;