import api, { handleRequest } from './apiConnection';

// ------------------------------------------
export async function verifyUserLogin(userData) {
  const result = await handleRequest(
    api.post("/loginVerification", userData)
  );
  return result;
}

// ------------------------------------------

export async function registerUser(userData) {
  console.log(userData)
  if (userData.password.length < 8) {
    return { message: "Password length must be 8 characters", error: true };
  }

  const dataToSend = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role
  };

  let result = await handleRequest(
    api.post("/registration", dataToSend)
  );
  console.log("register: ", result)
  return result;
}

// verify OTP
export async function verifyOTP(email, code) {
  let result = await handleRequest(
    api.post("/verifyEmail", { email, code })
  );
  return result;
}

// --------------- getCookiesData
export const cookiesData = async () => {
  const data = await handleRequest(
    api.get("/send-cookies-to-frontend")
  );
  return data.user;
}

export const logoutUser = async () => {
  const data = await handleRequest(
    api.get("/logout-user")
  );
  return data;
};

export const loginUserData = async () => {
  try {
    const response = await api.get("/loginUserData");
    
    if (response.status === 401) {
      return null;
    }

    const data = response.data;
    return data;

  } catch (error) {
    if (error.response && error.response.status === 401) {
      return null;
    }
    console.error("Error fetching user:", error);
    return null;
  }
};