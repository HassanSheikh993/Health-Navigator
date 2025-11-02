import api, { handleRequest } from './apiConnection';

export const doctorsList = async () => {
  const data = await handleRequest(
    api.get("/doctors-list")
  );
  return data;
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