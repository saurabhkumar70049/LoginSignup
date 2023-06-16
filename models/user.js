import mongoose from "mongoose";


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
    }
})

mongoose.model("User", userSchema); // it just use rename the name of schema means through out the application we refare it as user