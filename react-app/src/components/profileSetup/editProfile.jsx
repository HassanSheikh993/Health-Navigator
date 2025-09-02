import "../../styles/editProfile.css";

import { useEffect, useState } from "react";
import { updateProfile } from "../../services/profileApi";

import { loginUserData } from "../../services/api";

export function EditProfile() {

    const [doctorRole, setDoctorRole] = useState("");
    const [previewImage, setPreviewImage] = useState("https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png");
    const [file, setFile] = useState(null);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        country: "",
        city: "",
        address: "",
        specialization: "",
        description: ""

    })

    const [message, setMessage] = useState("");



    useEffect(() => {
        getUserData()
    }, [])

    async function getUserData() {
        const result = await loginUserData();
        console.log("HHHHHHHHHHHHHHHHHMM ",result)

        console.log(result)
        if (result.role === "doctor") {
            setDoctorRole(result.role)
        }

        setUserData({
            name: result.name || "",
            email: result.email || "",
            contactNumber: result.contactNumber || "",
            country: result.country || "",
            city: result.city || "",
            address: result.address || "",
            specialization: result.specialization || "",
            description: result.description || ""
        })

        setFile(result.picture || null);
setPreviewImage(
  result.picture
    ? `http://localhost:8000${result.picture}`
    : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
);

    }

    const handleOnChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        console.log(userData);
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const result = await updateProfile(userData, file);
        console.log("result: ", result)
        setMessage(result.message);
    }


    function postDetails(pics) {
        if (pics && (pics.type === "image/jpeg" || pics.type === "image/png")) {
            setFile(pics); // Store actual File object
        }
    }





    return (
        <>
            <div className="edit_old_container">
                <div className="edit_old_main">
                    <h1 className="edit_old_title">Profile</h1>
                    {/* <form action="" onSubmit={handleOnSubmit}>
                        <div className="edit_old_form_detail">
                            <label htmlFor="">Name</label>
                            <input type="text" name="name" value={userData.name} onChange={handleOnChange} />
                        </div>
                        <div className="edit_old_form_detail">
                            <label htmlFor="">Email</label>
                            <input type="email" name="email" value={userData.email} onChange={handleOnChange} disabled />
                        </div>
                        <div className="edit_old_form_detail">
                            <label htmlFor="">Contact Number</label>
                            <input type="number" name="contactNumber" value={userData.contactNumber} onChange={handleOnChange} />
                        </div>
                        <div className="edit_old_form_detail">
                            <label htmlFor="">Country</label>
                            <input type="text" name="country" value={userData.country} onChange={handleOnChange} />
                        </div>


                      

                        {
                            doctorRole && (
                                <>
                                    <div className="edit_old_form_detail">
                                        <label htmlFor="">City</label>
                                        <input type="text" name="city" value={userData.city} onChange={handleOnChange} />
                                    </div>
                                    <div className="edit_old_form_detail">
                                        <label htmlFor="">Address</label>
                                        <input type="text" name="address" value={userData.address} onChange={handleOnChange} />
                                    </div>

                                    <div className="edit_old_form_detail">
                                        <label htmlFor="">specialization</label>
                                        <input type="text" name="specialization" value={userData.specialization} onChange={handleOnChange} />
                                    </div>


                                    <div className="edit_old_form_detail">
                                        <label htmlFor="">Description</label>
                                        <textarea name="description" value={userData.description} onChange={handleOnChange}> </textarea>
                                    </div>
                                </>


                            )
                        }

                        

                        <button className="edit_old_form_button">Save Changes</button>
                    </form> */}


                    <form onSubmit={handleOnSubmit} className="edit_old_form">

                        <div className="edit_old_left">
                            <div className="edit_old_image_wrapper">
                                <img
                                    src={previewImage}
                                    alt="Profile"
                                    className="edit_old_profile_image"
                                />
                            <input type="file" name="profileImage"  className="edit_old_file_input" 
                            onChange={(e) => {const selectedFile = e.target.files[0];
                            if (selectedFile) {
                            setPreviewImage(URL.createObjectURL(selectedFile));
                            postDetails(selectedFile);
                            }
  }}
/>

                            </div>
                        </div>

                        <div className="edit_old_right">
                            <div className="edit_old_row">
                                <div className="edit_old_form_detail">
                                    <label>Name</label>
                                    <input type="text" name="name" value={userData.name} onChange={handleOnChange} />
                                </div>
                                <div className="edit_old_form_detail">
                                    <label>Email</label>
                                    <input type="email" name="email" value={userData.email} onChange={handleOnChange} disabled />
                                </div>
                            </div>

                            <div className="edit_old_row">
                                <div className="edit_old_form_detail">
                                    <label>Country</label>
                                    <input type="text" name="country" value={userData.country} onChange={handleOnChange} />
                                </div>
                                <div className="edit_old_form_detail">
                                    <label>Contact Number</label>
                                    <input type="number" name="contactNumber" value={userData.contactNumber} onChange={handleOnChange} />
                                </div>
                            </div>

                            {doctorRole && (
                                <>
                                    <div className="edit_old_row">
                                        <div className="edit_old_form_detail">
                                            <label>City</label>
                                            <input type="text" name="city" value={userData.city} onChange={handleOnChange} />
                                        </div>
                                        <div className="edit_old_form_detail">
                                            <label>Address</label>
                                            <input type="text" name="address" value={userData.address} onChange={handleOnChange} />
                                        </div>
                                    </div>

                                    <div className="edit_old_row">
                                        <div className="edit_old_form_detail">
                                            <label>Specialization</label>
                                            <input type="text" name="specialization" value={userData.specialization} onChange={handleOnChange} />
                                        </div>
                                    </div>

                                    <div className="edit_old_form_detail">
                                        <label>Description</label>
                                        <textarea name="description" value={userData.description} onChange={handleOnChange}></textarea>
                                    </div>
                                </>
                            )}

                            <button className="edit_old_form_button">Save Changes</button>
                            <h5 className="updateProfile_message">{message}</h5>
                        </div>
                    </form>

                    <h5 className="updateProfile_message">{message}</h5>
                </div>
            </div>
        </>
    )
}

