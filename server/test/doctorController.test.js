import { expect } from "chai";
import mongoose from "mongoose";

import { doctorReviewHistory,addDoctorReview,allDoctors,searchDoctors, rateDoctorFeedback,doctorsWithRatings, deleteSharedReport  } from "../controller/doctorController.js";
import { SharedReport } from "../model/sharedReportModel.js";
import { User } from "../model/userModel.js";

describe("doctorReviewHistory", () => {

  let doctorId;
  let patientId;
  let reportId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
      useNewUrlParser: true,
    });

    const doctor = await User.create({
      name: "Doctor Test",
      email: "doctor@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctorId = doctor._id;

    const patient = await User.create({
      name: "Patient Test",
      email: "patient@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    const report = await SharedReport.create({
      doctor_id: doctorId,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      viewedByDoctor: true
    });
    reportId = report._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return empty array if no reports found", async () => {
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await doctorReviewHistory(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").that.is.empty;
  });

  it("should return reports viewed by doctor", async () => {
    const req = { user: { id: doctorId } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await doctorReviewHistory(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;

    expect(data[0]).to.have.property("doctor_id");
    expect(data[0]).to.have.property("patient_id");
    expect(data[0]).to.have.property("report_id");
  });

});


describe("addDoctorReview", () => {

  let doctorId;
  let patientId;
  let sharedReportId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
      useNewUrlParser: true,
    });

    const doctor = await User.create({
      name: "Doctor Test",
      email: "doctor@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctorId = doctor._id;

    const patient = await User.create({
      name: "Patient Test",
      email: "patient@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    const sharedReport = await SharedReport.create({
      doctor_id: doctorId,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      viewedByDoctor: false
    });

    sharedReportId = sharedReport._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return 400 if data is incomplete", async () => {
    const req = { body: { doctorReviewedText: "Great report!" } }; // missing sharedReport_id
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await addDoctorReview(req, res);

    expect(statusCode).to.equal(400);
    expect(message).to.equal("Incomplete Data");
  });

  it("should return 201 if review is successfully added", async () => {
    const req = { body: { doctorReviewedText: "Excellent report", sharedReport_id: sharedReportId } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await addDoctorReview(req, res);

    expect(statusCode).to.equal(201);
    expect(message).to.equal("Review Sent");

    // verify in DB
    const updated = await SharedReport.findById(sharedReportId);
    expect(updated.doctor_review).to.equal("Excellent report");
    expect(updated.viewedByDoctor).to.equal(true);
    expect(updated.doctor_reviewedAt).to.be.instanceOf(Date);
  });

  it("should return 404 if no matching report found", async () => {
    const req = { body: { doctorReviewedText: "Test", sharedReport_id: new mongoose.Types.ObjectId() } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await addDoctorReview(req, res);

    expect(statusCode).to.equal(404);
    expect(message).to.equal("No matching report found");
  });

});


describe("allDoctors", () => {

  let doctor1Id, doctor2Id, patientId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const doctor1 = await User.create({
      name: "Doctor One",
      email: "doctor1@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctor1Id = doctor1._id;

    const doctor2 = await User.create({
      name: "Doctor Two",
      email: "doctor2@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctor2Id = doctor2._id;

    const patient = await User.create({
      name: "Patient Test",
      email: "patient@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    await SharedReport.create({
      doctor_id: doctor1Id,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      patient_rating: 4
    });

    await SharedReport.create({
      doctor_id: doctor2Id,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      patient_rating: 5
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return all doctors with rating stats", async () => {
    const req = { user: { role: "patient" } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await allDoctors(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").with.lengthOf(2);

    const doctor1 = data.find(d => d._id.toString() === doctor1Id.toString());
    const doctor2 = data.find(d => d._id.toString() === doctor2Id.toString());

    expect(doctor1.averageRating).to.equal(4);
    expect(doctor1.totalRatings).to.equal(1);

    expect(doctor2.averageRating).to.equal(5);
    expect(doctor2.totalRatings).to.equal(1);

    // sorted by highest rating
    expect(data[0]._id.toString()).to.equal(doctor2Id.toString());
  });

  it("should exclude requesting doctor if role is doctor", async () => {
    const req = { user: { role: "doctor", _id: doctor1Id } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await allDoctors(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").with.lengthOf(1);
    expect(data[0]._id.toString()).to.equal(doctor2Id.toString());
  });

});


describe("searchDoctors", () => {

  let doctor1Id, doctor2Id, patientId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const doctor1 = await User.create({
      name: "Doctor One",
      email: "doctor1@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctor1Id = doctor1._id;

    const doctor2 = await User.create({
      name: "Doctor Two",
      email: "doctor2@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctor2Id = doctor2._id;

    const patient = await User.create({
      name: "Patient Test",
      email: "patient@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    await SharedReport.create({
      doctor_id: doctor1Id,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      patient_rating: 4
    });

    await SharedReport.create({
      doctor_id: doctor2Id,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      patient_rating: 5
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return all doctors matching search with rating stats", async () => {
    const req = { query: { search: "Doctor" }, user: { role: "patient" } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await searchDoctors(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").with.lengthOf(2);

    const doctor1 = data.find(d => d._id.toString() === doctor1Id.toString());
    const doctor2 = data.find(d => d._id.toString() === doctor2Id.toString());

    expect(doctor1.averageRating).to.equal(4);
    expect(doctor1.totalRatings).to.equal(1);

    expect(doctor2.averageRating).to.equal(5);
    expect(doctor2.totalRatings).to.equal(1);

    expect(data[0]._id.toString()).to.equal(doctor2Id.toString());
  });

  it("should exclude requesting doctor if role is doctor", async () => {
    const req = { query: { search: "Doctor" }, user: { role: "doctor", _id: doctor1Id } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await searchDoctors(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").with.lengthOf(1);
    expect(data[0]._id.toString()).to.equal(doctor2Id.toString());
  });

  it("should return empty array if no doctors match search", async () => {
    const req = { query: { search: "Nonexistent" }, user: { role: "patient" } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await searchDoctors(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").that.is.empty;
  });

});


describe("rateDoctorFeedback", () => {
  let patientId, doctorId, sharedReportId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const doctor = await User.create({
      name: "Doctor Test",
      email: "doctor@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctorId = doctor._id;

    const patient = await User.create({
      name: "Patient Test",
      email: "patient@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    const sharedReport = await SharedReport.create({
      doctor_id: doctorId,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      viewedByDoctor: true
    });
    sharedReportId = sharedReport._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return 400 if rating is missing or invalid", async () => {
    const req = { params: { sharedReportId }, body: { rating: 6 }, user: { _id: patientId } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await rateDoctorFeedback(req, res);

    expect(statusCode).to.equal(400);
    expect(message).to.equal("Rating must be between 1 and 5");
  });

  it("should return 404 if shared report not found", async () => {
    const req = { params: { sharedReportId: new mongoose.Types.ObjectId() }, body: { rating: 4 }, user: { _id: patientId } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await rateDoctorFeedback(req, res);

    expect(statusCode).to.equal(404);
    expect(message).to.equal("Shared report not found");
  });

  it("should return 403 if patient is not owner of the report", async () => {
    const anotherPatient = await User.create({ name: "Other Patient", email: "other@abc.com", password: "12345678", role: "patient" });

    const req = { params: { sharedReportId }, body: { rating: 4 }, user: { _id: anotherPatient._id } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await rateDoctorFeedback(req, res);

    expect(statusCode).to.equal(403);
    expect(message).to.equal("Not authorized to rate this report");
  });

  it("should submit rating successfully", async () => {
    const req = { params: { sharedReportId }, body: { rating: 5, review: "Excellent doctor" }, user: { _id: patientId } };
    let statusCode, data;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await rateDoctorFeedback(req, res);

    expect(statusCode).to.equal(200);
    expect(data.message).to.equal("Rating submitted successfully");
    expect(data.data.patient_rating).to.equal(5);
    expect(data.data.patient_review).to.equal("Excellent doctor");
    expect(data.data.ratedAt).to.be.instanceOf(Date);
  });
});


describe("doctorsWithRatings", () => {
  let doctor1Id, doctor2Id, patientId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const doctor1 = await User.create({
      name: "Doctor One",
      email: "doctor1@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctor1Id = doctor1._id;

    const doctor2 = await User.create({
      name: "Doctor Two",
      email: "doctor2@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctor2Id = doctor2._id;

    const patient = await User.create({
      name: "Patient Test",
      email: "patient@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    await SharedReport.create({
      doctor_id: doctor1Id,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      patient_rating: 4
    });

    await SharedReport.create({
      doctor_id: doctor2Id,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      patient_rating: 5
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return all doctors with rating stats", async () => {
    let data, statusCode;

    const req = {};
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await doctorsWithRatings(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").with.lengthOf(2);

    const doctor1 = data.find(d => d._id.toString() === doctor1Id.toString());
    const doctor2 = data.find(d => d._id.toString() === doctor2Id.toString());

    expect(doctor1.averageRating).to.equal(4);
    expect(doctor1.totalRatings).to.equal(1);

    expect(doctor2.averageRating).to.equal(5);
    expect(doctor2.totalRatings).to.equal(1);
  });
});


describe("deleteSharedReport", () => {
  let doctorId, patientId, sharedReportId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const doctor = await User.create({
      name: "Doctor Test",
      email: "doctor@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctorId = doctor._id;

    const patient = await User.create({
      name: "Patient Test",
      email: "patient@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    const sharedReport = await SharedReport.create({
      doctor_id: doctorId,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId()
    });
    sharedReportId = sharedReport._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return 400 if sharedReport_id is missing", async () => {
    let statusCode, message;

    const req = { user: { id: doctorId }, params: {} };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await deleteSharedReport(req, res);

    expect(statusCode).to.equal(400);
    expect(message).to.equal("SharedReport ID missing");
  });

  it("should return 404 if report not found or not authorized", async () => {
    let statusCode, message;

    const req = { user: { id: doctorId }, params: { sharedReport_id: new mongoose.Types.ObjectId() } };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await deleteSharedReport(req, res);

    expect(statusCode).to.equal(404);
    expect(message).to.equal("Report not found or not authorized");
  });

  it("should delete the shared report successfully", async () => {
    let statusCode, message;

    const req = { user: { id: doctorId }, params: { sharedReport_id: sharedReportId } };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await deleteSharedReport(req, res);

    expect(statusCode).to.equal(200);
    expect(message).to.equal("Report deleted successfully");

    const report = await SharedReport.findById(sharedReportId);
    expect(report).to.be.null;
  });
});