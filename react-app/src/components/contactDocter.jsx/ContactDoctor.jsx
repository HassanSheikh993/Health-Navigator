import "../../styles/contactDoctor.css";
import { useState, useEffect } from "react";
import { DoctorRecordSetUp } from "./doctorRecordSetUp";
// import { doctorsList } from "../../services/doctorListApi";
import { doctorsList,searchDoctors } from "../../services/doctor";
import { useLocation } from 'react-router'
import { SendReportPopup } from "./sendDoctorPopUp";








export function ContactDoctor() {
  const [showPopup, setShowPopup] = useState(false);
  const [showMoreIndex, setShowMoreIndex] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const location = useLocation();
  const shareMode = location.state?.shareMode || false;
   const selectedReports = location.state?.selectedReports || [];

  const toggleDetails = (index) => {
    setShowMoreIndex(showMoreIndex === index ? null : index);
  };

  // Fetch doctors from API when component loads
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorsList();
        setDoctors(response);  // assuming API returns an array
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  async function handleSearch() {
    const result = await searchDoctors(searchValue);
    setDoctors(result);
  }

   function handleSendReport(doctor) {
     setSelectedDoctor(doctor); 
    setShowPopup(true);
  }

  function handleClosePopup() {
    setShowPopup(false);
    setSelectedDoctor(null);
  }

  return (
    <>
      <div className="search_filter">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search doctors, services, or contact..."
            className="search-input"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>🔍</button>
        </div>
      </div>

      <div className="doctor_record_main_container">
        {doctors.map((doctor, index) => (
          <div className="doctor_record" key={doctor._id || index}>
            <div className="doctor_record_upper_part">
              <div className="doctor_record_upper_part_name_country">
                <div>
                  <img
                    className="doctor_record_upper_part_image"
                    src={doctor.picture ? `http://localhost:8000${doctor.picture}` : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                    alt="User Profile"
                  />
                </div>
                <div>
                  <h1 className="doctor_name">{doctor.name}</h1>
                  <h2 className="doctor_country">{doctor.country}</h2>
                </div>
              </div>

              <div className="doctor_buttons">
                <button className="toggle_btn" onClick={() => toggleDetails(index)}>
                  {showMoreIndex === index ? 'Hide Details' : 'Show Details'}
                </button>

                {shareMode && (
                  <button 
                    className="send_report_btn" 
                    onClick={() => handleSendReport(doctor)}
                  >
                    Send Report
                  </button>
                )}
              </div>
            </div>
            <div className={`doctor_extra_details ${showMoreIndex === index ? 'show' : 'hide'}`}>
              <DoctorRecordSetUp data={doctor} />
            </div>
          </div>
        ))}
      </div>

      <SendReportPopup 
        isOpen={showPopup} 
        onClose={handleClosePopup} 
        doctor={selectedDoctor}
        selectedReports={selectedReports}
       
      />
    </>
  );
}