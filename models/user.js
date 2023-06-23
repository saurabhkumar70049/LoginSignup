import mongoose from "mongoose";

//most costly operation in backend is database
//this is schema, it tell that how we store the data in database
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        require:true
    },
    email: {
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    token:{
        type: String 
    }
})

mongoose.model("User", userSchema); // it just use rename the name of schema means through out the application we refare it as user

//jwt => json web token
//it generate new token for every user 