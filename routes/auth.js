import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt"; //it is use for encript and decript the data 
const authRouter = express.Router();
const user = mongoose.model("User");


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


    



    // if(!name || !email || !password) {
    //     return res.send('Please Enter all the data ')
    // }
    // else {
    //     console.log(`name : ${name}, email : ${email}, password : ${password}`);
    //     return res.send("data Received");
    // }


    //check if user already exist
    
})


authRouter.post('/login', (req, res)=> {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.send({error : "Please add all the fields"});
    }

    //email validation //regex

    user.findOne({email: email})
    .then((foundUser) =>{
        console.log("foundUser : " , foundUser);
        if(foundUser == null) {
            return res.send({error : "User not Found"});
        }
        bcrypt.compare(password, foundUser.password)
        .then((result)=> {
            if(result == false) {
                return res.send('Invalid password');
            }
            return res.send({success: true, message: "User logged in successfully", data: foundUser})
        })
    })
})

export default authRouter;