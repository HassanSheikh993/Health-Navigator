export function DoctorRecordSetUp({ data }) {
      const displayValue = (value) => {
        return value && value !== "NaN" ? value : "—";
    };
    return (
        <>
        {console.log(data)}
        <div className="doctor_details_grid">
                 <div><strong>City:</strong></div>
            <div>{displayValue(data.city)}</div>

            <div><strong>Contact:</strong></div>
            <div>{displayValue(data.contactNumber)}</div>

            <div><strong>Email:</strong></div>
            <div>{displayValue(data.email)}</div>

            <div><strong>Address:</strong></div>
            <div>{displayValue(data.address)}</div>

            <div><strong>Specialization:</strong></div>
            <div>{displayValue(data.specialization)}</div>

            <div><strong>Description:</strong></div>
            <div>{displayValue(data.description)}</div>
        </div>
        </>
    );
}