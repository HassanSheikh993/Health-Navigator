import { User } from "../model/userModel.js";
export const updateProfile = async (req, res) => {
    try {
        console.log(req.file)
        const userData = req.body;
        console.log("backend: ", userData);

        const email = userData.email;
        console.log(userData.description)


        let updateFields = {}
    
        if (userData.country) updateFields.country = userData.country;    
        if (userData.contactNumber) updateFields.contactNumber = userData.contactNumber
        if (userData.city) updateFields.city = userData.city;
        if (userData.address) updateFields.address = userData.address;
        if (userData.specialization) updateFields.specialization = userData.specialization;
        if (userData.description) updateFields.description = userData.description;


if(req.file){
  // store relative URL
  updateFields.picture = `/uploadProfileImages/${req.file.filename}`;
}


        const result = await User.updateOne(
            { email: email },
            { $set: updateFields }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Profile updated successfully" });
        } else {
            res.status(404).json({ message: "User not found or no changes made" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};




export const loginUserData = async (req, res) => {
    try {
        const result = await User.findById(req.user.id).select("-password"); // exclude password
        
        if (!result) {
            return res.status(200).json([]);
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error("Error in loginUserData:", err);
        return res.status(500).json({ message: "Server error" });
    }
};