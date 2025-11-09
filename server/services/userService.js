import { User } from "../model/userModel.js";

export const findUserByEmail = async (email)=>{
   const response = await User.findOne({email});
   if(!response) return false;
   return response;
}