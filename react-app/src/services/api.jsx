
// ------------------------------------------

export async function verifyUserLogin(userData){
const response = await fetch("http://localhost:8000/api/loginVerification",{
  method:"POST",
  headers: { "Content-Type": "application/json" },
  body:JSON.stringify(userData),
  credentials:"include"
}
);

let result = await response.json();
return result

  }

// ------------------------------------------



// register user (send OTP)
export async function registerUser(userData) {
  console.log(userData)
  if (userData.password.length < 8) {
    return { message: "Password length must be 8 characters", error: true };
  }

  const dataToSend = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role:userData.role
  };

  let response = await fetch("http://localhost:8000/api/registration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
  });

  let result = await response.json();

  console.log("register: ",result)
  return result;
}

// verify OTP
export async function verifyOTP(email, code) {
  let response = await fetch("http://localhost:8000/api/verifyEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  let result = await response.json();
  return result;
}



// --------------- getCookiesData

export const cookiesData = async()=>{
  let response = await fetch("http://localhost:8000/api/send-cookies-to-frontend",{
    method: "GET",
    credentials: "include"
  })

  const data = await response.json();
  return data.user;

}


export const logoutUser = async () => {
  let response = await fetch("http://localhost:8000/api/logout-user", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return data;  
};



// -----------------------------------------

export const loginUserData = async()=>{
  try{
    let response = await fetch("http://localhost:8000/api/loginUserData",{
    method:"GET",
    credentials:"include"
  });
   const data = await response.json();
  return data;  
  }catch(err){
     console.error("Error fetching doctors:", err);
        return []; 
  }


}


