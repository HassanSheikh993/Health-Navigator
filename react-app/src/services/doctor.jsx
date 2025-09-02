
export const doctorsList = async () => {
  const response = await fetch("http://localhost:8000/api/doctors-list", {
    method: "GET",
    credentials: "include"
  });

  const data = await response.json();
  return data; 
};


export const searchDoctors = async (searchItem) => {
    try {
        console.log("Searching for:", searchItem);

        const response = await fetch(
            `http://localhost:8000/api/search-doctor?search=${encodeURIComponent(searchItem)}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        console.log("Search results:", data);

        return data;
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return []; 
    }
};