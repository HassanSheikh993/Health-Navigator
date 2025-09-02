import mongoose from "mongoose";

const sharedReportModelSchema = mongoose.Schema({
   report_id:{type:String},
   patient_email:{type:String},
   doctor_email:{type:String},
   viewedByDoctor: { type: Boolean, default: false }
},{ timestamps: true })