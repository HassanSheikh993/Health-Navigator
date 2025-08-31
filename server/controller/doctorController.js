import { User } from "../model/userModel.js";

export const allDoctors = async (req, res) => {
  try {
    const result = await User.find({ role: "doctor" });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error });
  }
};


export const searchDoctors = async(req,res)=>{
console.log(req.query.search)
try{
  const keyword = req.query.search ?
{
  role: "doctor",
  $or: [
    { name: { $regex: req.query.search, $options: "i" } },
    { email: req.query.search }
  ]
} : {}

const result = await User.find(keyword)

  if(result){
    return res.status(200).json(result)
  }
  res.status(404).send("nothing")

}catch(err){
  console.log("Error in searchDoctor: ",err);
  res.status(500);
}
}