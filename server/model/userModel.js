import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { type: String },
    isVerified: { type: Boolean, default: false },
    picture:{type:String},
    contactNumber: { type: String },
    country: { type: String },
    city: { type: String },
    address: { type: String },
    specialization: {type: String},
    description: {type:String},
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });



// check password

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}



// hashing password
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next(); 
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); 
});



export const User = mongoose.model("user",userSchema);