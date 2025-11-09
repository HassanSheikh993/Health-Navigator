// export async function updateProfile(userData,file) {
//   console.log("update profile api: ",userData)

//   let response = await fetch("http://localhost:8000/api/update-profile", {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(userData),
//   });

//   let result = await response.json();
//   return result;
// }



export async function updateProfile(userData, file) {
  console.log("update profile api: ", userData, file);

  const formData = new FormData();

  // Append text fields
  Object.keys(userData).forEach(key => {
    formData.append(key, userData[key]);
  });

  // Append file (if provided)
  if (file) {
    formData.append("file", file); // name should match backend field
  }

  let response = await fetch("http://localhost:8000/api/update-profile", {
    method: "PUT",
    body: formData, // No need for headers, browser sets multipart/form-data automatically
  });

  let result = await response.json();
  return result;
}
