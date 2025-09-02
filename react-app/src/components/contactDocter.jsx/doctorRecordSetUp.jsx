export function DoctorRecordSetUp({ data }) {
    return (
        <>
            {data.city ? <p><strong>City:</strong> {data.city}</p>: <p><strong>City: </strong>NaN</p>}
            {data.contactNumber ? <p><strong>Contact:</strong> {data.contactNumber}</p> : <p><strong>Contact: </strong>NaN</p> }
            {data.email ? <p><strong>Email:</strong> {data.email}</p> : <p><strong>:Email: </strong>NaN </p> }
            {data.address ? <p><strong>Address:</strong> {data.address}</p> : <p><strong>Address: </strong>NaN </p> } 
        
        </>
    );
}
