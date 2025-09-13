// reports all apis

export const uploadMedicalReport = async (report) => {
  const formData = new FormData();
  formData.append("report", report); 

  const res = await fetch("http://localhost:8000/api/upload-report", {
    method: "POST",
    credentials: "include", 
    body: formData
  });

  const data = await res.json();
  return data;
};


export const getAllReportsForDoctor = async()=>{
   const res = await fetch("http://localhost:8000/api/getDoctorReports",{
    method:"GET",
    credentials:"include"
   })

   const data = await res.json();
  return data;
}


export const addDoctorReview = async (review, doctor_email, patient_id, report_id) => {
  const dataToSend = {
    doctorReviewedText: review,
    doctor_email,
    patient_id,
    report_id
  };

  const response = await fetch("http://localhost:8000/api/addDoctorReview", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataToSend)
  });

  const res = await response.json();
  console.log(res);
  return res;
};



export const getReportStats = async()=>{
const response = await fetch("http://localhost:8000/api/getReportStats",{
  method:"GET",
  credentials:"include"
})
const res = await response.json();
return res;
}


export const doctorReviewHistory = async()=>{
  const result = await fetch("http://localhost:8000/api/doctorReviewHistory",{
    method:"GET",
    credentials:"include"
  })

  const res = await result.json();
  return res;
}

// doctor
export const displayAllReports = async()=>{
  const result = await fetch("http://localhost:8000/api/sendReportToDoctor",{
    method:"GET",
    credentials:"include"
  })

  const res = result.json();
  return res;
}


//user
export const displayReports = async()=>{
  const result = await fetch("http://localhost:8000/api/allReports",{
    method:"GET",
    credentials:"include"
  })
  const res = await result.json();
  return res;
}


export const deleteUserReport = async(reportId)=>{
  const result = await fetch("http://localhost:8000/api/deleteUserReport",{
    method:"DELETE",
    credentials:"include",
     headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: reportId }), 
  })

  const res = await result.json();
return res
}


export const sendReportToDoctor = async(reports,doctor_id)=>{
  const result = await fetch("http://localhost:8000/api/sendReports",{
    method:"POST",
    credentials:"include",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({reports:reports,doctor_id:doctor_id})
  })

  const res = await result.json();
  return res;
}