// import mongoose from "mongoose";


// const reportSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
//   reportPath: { type: String, required: true },
//   simplifiedReport: { type: String, default: null },
//   keyValues: { type: Object }
// }, { timestamps: true });


// export const Report = mongoose.model("report", reportSchema);

import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    reportPath: { type: String, required: true },

    // Smart report (AI generated)
    simplifiedReport: { type: String, default: null },

    // extracted key-value data if needed later
    keyValues: { type: Object },
  },
  { timestamps: true }
);

export const Report = mongoose.model("report", reportSchema);
