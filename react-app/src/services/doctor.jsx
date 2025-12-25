import api, { handleRequest } from './apiConnection';

export const doctorsList = async () => {
  return await handleRequest(api.get("/doctors-list"));
};

export const searchDoctors = async (searchItem) => {
  try {
    console.log("Searching for:", searchItem);

    const data = await handleRequest(
      api.get(`/search-doctor?search=${encodeURIComponent(searchItem)}`)
    );
    
    console.log("Search results:", data);
    return data;

  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};
export const getDoctorsWithRatings = async () => {
  return await handleRequest(api.get("/doctors-with-ratings"));
};

export const doctorReviewHistory = async () => {
  const response = await api.get("/doctorReviewHistory");
  return response.data;
};

export const addDoctorReview = async (review,sharedReport_id) => {
  const dataToSend = {
    doctorReviewedText: review, 
    sharedReport_id,
  };

  const response = await api.put("/addDoctorReview", dataToSend);
  console.log(response.data);
  return response.data;
};

export const deleteSharedReport = async (sharedReport_id) => {
  const response = await api.delete(`/deleteSharedReport/${sharedReport_id}`);
  return response.data;
};
