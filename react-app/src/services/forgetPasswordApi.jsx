export const forgetPassword = async (email) => {
  console.log(email);
  let response = await fetch("http://localhost:8000/api/forgetPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email }), // ✅ send as JSON object
  });

  let result = await response.json();
  return result;
};


export const verifyOTP_forForgetPassword = async (email,code) =>{
     const response = await fetch("http://localhost:8000/api/verify-OTP-forget-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });
  return await response.json();

}


export const updatePassword = async (email, password) => {
  const response = await fetch("http://localhost:8000/api/update-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return await response.json();
};