import api, { handleRequest } from './apiConnection';

export async function updateProfile(userData, file) {
  try {
    console.log("update profile api: ", userData, file);

    const formData = new FormData();

    // Append text fields
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key]);
    });

    // Append file (if provided)
    if (file) {
      formData.append("file", file);
    }

    const result = await handleRequest(
      api.put("/update-profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
    
    console.log("Update profile result:", result);
    return result;
    
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { 
      success: false, 
      message: "Failed to update profile",
      error: error.message 
    };
  }
}