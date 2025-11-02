


import api from "./apiConnection";

export const forgetPassword = async (email) => {
  console.log(email);

  try {
    const response = await api.post("/forgetPassword", { email });
    console.log("API call:", response.data);
    return { status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return { status: 500, data: { message: "Network error" } };
  }
};

export const verifyOTP_forForgetPassword = async (email, code) => {
  try {
    const response = await api.post("/verify-OTP-forget-password", { email, code });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return { status: 500, data: { message: "Network error" } };
  }
};

export const updatePassword = async (email, password) => {
  try {
    const response = await api.post("/update-password", { email, password });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return { status: 500, data: { message: "Network error" } };
  }
};