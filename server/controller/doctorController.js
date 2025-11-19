import { User } from "../model/userModel.js";
import { SharedReport } from "../model/sharedReportModel.js";
import { Report } from "../model/reportModel.js";

export const doctorReviewHistory = async (req, res) => {
  try {
    const doctor_id = req.user.id;
    const result = await SharedReport.find({
      $and: [
        { doctor_id: doctor_id },
        { viewedByDoctor: true }
      ]
    }).populate("patient_id", "_id name email picture")
      .populate("report_id", "_id reportPath")


    if (!result || result.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(result);


  } catch (err) {
    console.log("Error in doctorReviewHistory function ", err);
    res.status(500).json({ message: "Error doctorReviewHistory", error: err.message });

  }
}


export const addDoctorReview = async (req, res) => {
  try {
    const { doctorReviewedText, patient_id, report_id } = req.body;
    if (!doctorReviewedText || !patient_id || !report_id) return res.status(400).json({ message: "Incomplete Data" });


    const result = await SharedReport.updateOne(
      { doctor_id: req.user.id, patient_id: patient_id, report_id: report_id },
      {
        $set: {
          doctor_review: doctorReviewedText,
          viewedByDoctor: true,
          doctor_reviewedAt: new Date()
        }
      });

    if (result.modifiedCount > 0) {
      return res.status(201).json({ message: "Review Sent" });
    } else {
      return res.status(404).json({ message: "No matching report found" });
    }

  } catch (err) {
    console.log("Error in addDoctorReview function ", err);
    res.status(500).json({ message: "Error addDoctorReview", error: err.message });
  }

}


export const allDoctors = async (req, res) => {
  try {
    // Get all doctors
    const doctors = await User.find({ role: "doctor" });

    // Get rating stats
    const ratingStats = await SharedReport.aggregate([
      { $match: { patient_rating: { $ne: null } } },
      {
        $group: {
          _id: "$doctor_id",
          averageRating: { $avg: "$patient_rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    // Convert stats into a map for fast lookup
    const ratingMap = {};
    ratingStats.forEach(r => {
      ratingMap[r._id.toString()] = {
        averageRating: r.averageRating,
        totalRatings: r.totalRatings
      };
    });

    // Merge ratings into doctor list
    let finalDoctors = doctors.map(doc => ({
      ...doc.toObject(),
      averageRating: ratingMap[doc._id]?.averageRating || 0,
      totalRatings: ratingMap[doc._id]?.totalRatings || 0
    }));

    // Sort by highest rating first
    finalDoctors = finalDoctors.sort((a, b) => b.averageRating - a.averageRating);

    res.status(200).json(finalDoctors);

  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};



export const searchDoctors = async (req, res) => {
  try {
    const search = req.query.search || "";

    // Build search filter (only doctors)
    const keyword = {
      role: "doctor",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: search }
      ]
    };

    // 1️⃣ Fetch doctors matching search
    const doctors = await User.find(keyword);

    if (!doctors.length) {
      return res.status(200).json([]); // return empty list, not 404
    }

    // 2️⃣ Fetch rating stats for only found doctors
    const doctorIds = doctors.map(d => d._id);

    const ratingStats = await SharedReport.aggregate([
      { 
        $match: { 
          doctor_id: { $in: doctorIds },
          patient_rating: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$doctor_id",
          averageRating: { $avg: "$patient_rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    // 3️⃣ Convert stats -> map
    const ratingMap = {};
    ratingStats.forEach(r => {
      ratingMap[r._id.toString()] = {
        averageRating: r.averageRating,
        totalRatings: r.totalRatings
      };
    });

    // 4️⃣ Merge ratings with doctor list
    let finalDoctors = doctors.map(doc => ({
      ...doc.toObject(),
      averageRating: ratingMap[doc._id]?.averageRating || 0,
      totalRatings: ratingMap[doc._id]?.totalRatings || 0
    }));

    // 5️⃣ Sort: highest rated first
    finalDoctors = finalDoctors.sort((a, b) => b.averageRating - a.averageRating);

    res.status(200).json(finalDoctors);

  } catch (err) {
    console.log("Error in searchDoctors: ", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const rateDoctorFeedback = async (req, res) => {
  try {
    const { sharedReportId } = req.params;
    const { rating, review } = req.body;
    const patientId = req.user?._id;  // Assuming auth middleware sets req.user

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const sharedReport = await SharedReport.findById(sharedReportId);
    if (!sharedReport) {
      return res.status(404).json({ message: "Shared report not found" });
    }

    // Ensure the patient who owns the report is the one rating it
    if (sharedReport.patient_id.toString() !== patientId.toString()) {
      return res.status(403).json({ message: "Not authorized to rate this report" });
    }

    sharedReport.patient_rating = rating;
    sharedReport.patient_review = review || "";
    sharedReport.ratedAt = new Date();

    await sharedReport.save();

    res.status(200).json({
      message: "Rating submitted successfully",
      data: sharedReport
    });

  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const doctorsWithRatings = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });

    const ratingStats = await SharedReport.aggregate([
      { $match: { patient_rating: { $ne: null } } },
      {
        $group: {
          _id: "$doctor_id",
          averageRating: { $avg: "$patient_rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    const ratingMap = {};
    ratingStats.forEach(r => {
      ratingMap[r._id.toString()] = {
        averageRating: r.averageRating,
        totalRatings: r.totalRatings
      };
    });

    const finalDoctors = doctors.map(doc => ({
      ...doc.toObject(),
      averageRating: ratingMap[doc._id]?.averageRating || 0,
      totalRatings: ratingMap[doc._id]?.totalRatings || 0
    }));

    res.status(200).json(finalDoctors);

  } catch (error) {
    console.error("Error fetching doctors with ratings:", error);
    res.status(500).json({ message: "Error fetching doctors with ratings" });
  }
};
