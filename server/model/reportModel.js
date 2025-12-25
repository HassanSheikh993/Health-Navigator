import mongoose from "mongoose";


const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  reportPath: { type: String, required: true },
  smartReport: { type: String, default: null },
  keyValues: { type: Object }
}, { timestamps: true });


export const Report = mongoose.model("report", reportSchema);
