import mongoose from "mongoose";

const sharedReportModelSchema = mongoose.Schema({
   report_id:{ type: mongoose.Schema.Types.ObjectId, ref: "report", required: true },
   patient_id:{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
   doctor_email:{type:String},
   viewedByDoctor: { type: Boolean, default: false },
   doctor_review: { type: String, default: "" }
},{ timestamps: true })

export const SharedReport = mongoose.model("sharedReport",sharedReportModelSchema);