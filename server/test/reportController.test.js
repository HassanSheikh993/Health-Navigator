import { expect } from "chai";
import mongoose from "mongoose";
import { sendReportToDoctor,displayReports,getAllReportsForDoctor,getReportStats,deleteUserReport,getUserReportsWithFeedback } from "../controller/reportController.js";
import { SharedReport } from "../model/sharedReportModel.js";
import { User } from "../model/userModel.js";
import { Report } from "../model/reportModel.js"; 

describe("sendReportToDoctor", () => {
  let patientId, doctorId, reportId1, reportId2;

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

    reportId1 = new mongoose.Types.ObjectId();
    reportId2 = new mongoose.Types.ObjectId();
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return 400 if required fields are missing", async () => {
    const req = { body: { reports: null, doctor_id: null }, user: { id: patientId } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await sendReportToDoctor(req, res);

    expect(statusCode).to.equal(400);
    expect(message).to.equal("Missing required fields");
  });

  it("should send single report to doctor", async () => {
    const req = { body: { reports: reportId1, doctor_id: doctorId }, user: { id: patientId } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await sendReportToDoctor(req, res);

    expect(statusCode).to.equal(201);
    expect(message).to.equal("Report send");

    const saved = await SharedReport.find({ patient_id: patientId, doctor_id: doctorId });
    expect(saved).to.have.lengthOf(1);
    expect(saved[0].report_id.toString()).to.equal(reportId1.toString());
  });

  it("should send multiple reports to doctor", async () => {
    const req = { body: { reports: [reportId1, reportId2], doctor_id: doctorId }, user: { id: patientId } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await sendReportToDoctor(req, res);

    expect(statusCode).to.equal(201);
    expect(message).to.equal("Report send");

    const saved = await SharedReport.find({ patient_id: patientId, doctor_id: doctorId });
    expect(saved).to.have.lengthOf(3); // 1 from previous test + 2 now
  });
});



describe("displayReports", () => {
  let userId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "12345678",
      role: "patient"
    });
    userId = user._id;

    await Report.create({
      user: userId,
      reportPath: "report1.pdf"
    });

    await Report.create({
      user: userId,
      reportPath: "report2.pdf"
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return an array of reports for the user", async () => {
    const req = { user: { id: userId } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await displayReports(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").with.lengthOf(2);
    expect(data[0]).to.have.property("reportPath");
    expect(data[0]).to.have.property("user");
  });

  it("should return empty array if user has no reports", async () => {
    const newUser = await User.create({
      name: "Empty User",
      email: "emptyuser@example.com",
      password: "12345678",
      role: "patient"
    });

    const req = { user: { id: newUser._id } };
    let data, statusCode;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await displayReports(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").that.is.empty;
  });
});


describe("getAllReportsForDoctor", () => {
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

    const report = await SharedReport.create({
      doctor_id: doctorId,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId()
    });
    sharedReportId = report._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return 404 if no reports found", async () => {
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    let statusCode, data;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await getAllReportsForDoctor(req, res);

    expect(statusCode).to.equal(404);
    expect(data.message).to.equal("No reports");
  });

  it("should return reports for the doctor", async () => {
    const req = { user: { id: doctorId } };
    let statusCode, data;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await getAllReportsForDoctor(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;
    expect(data[0]).to.have.property("doctor_id");
    expect(data[0]).to.have.property("patient_id");
    expect(data[0]).to.have.property("report_id");
  });
});


describe("getReportStats", () => {
  let doctorId, patientId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const doctor = await User.create({
      name: "Doctor Stats",
      email: "doctorstats@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctorId = doctor._id;

    const patient = await User.create({
      name: "Patient Stats",
      email: "patientstats@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    const today = new Date();
    const earlierThisMonth = new Date();
    earlierThisMonth.setDate(1);
    earlierThisMonth.setHours(10, 0, 0, 0);

    await SharedReport.create({
      doctor_id: doctorId,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      createdAt: today
    });

    await SharedReport.create({
      doctor_id: doctorId,
      patient_id: patientId,
      report_id: new mongoose.Types.ObjectId(),
      createdAt: earlierThisMonth
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return the correct counts for today and month", async () => {
    const req = { user: { id: doctorId } };
    let statusCode, data;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await getReportStats(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.have.property("today").that.is.a("number");
    expect(data).to.have.property("month").that.is.a("number");
    expect(data.today).to.equal(1);
    expect(data.month).to.equal(2);
  });

  it("should return 0 counts if doctor has no reports", async () => {
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    let statusCode, data;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await getReportStats(req, res);

    expect(statusCode).to.equal(200);
    expect(data.today).to.equal(0);
    expect(data.month).to.equal(0);
  });
});

describe("deleteUserReport", () => {
  let userId, report1Id, report2Id;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const user = await User.create({
      name: "Test User",
      email: "testuser@abc.com",
      password: "12345678",
      role: "patient"
    });
    userId = user._id;

    const report1 = await Report.create({
      user: userId,
      reportPath: "/reports/report1.pdf"
    });
    const report2 = await Report.create({
      user: userId,
      reportPath: "/reports/report2.pdf"
    });

    report1Id = report1._id;
    report2Id = report2._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return 400 if no ids provided", async () => {
    const req = { body: {} };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await deleteUserReport(req, res);

    expect(statusCode).to.equal(400);
    expect(message).to.equal("Report Id is not send");
  });

  it("should delete reports successfully", async () => {
    const req = { body: { ids: [report1Id, report2Id] } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await deleteUserReport(req, res);

    expect(statusCode).to.equal(200);
    expect(message).to.equal("Report Deleted");

    const remaining = await Report.find({ user: userId });
    expect(remaining.length).to.equal(0);
  });

  it("should return 404 if reports not found", async () => {
    const req = { body: { ids: [new mongoose.Types.ObjectId()] } };
    let statusCode, message;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await deleteUserReport(req, res);

    expect(statusCode).to.equal(404);
    expect(message).to.equal("No Report Deleted");
  });
});


describe("getUserReportsWithFeedback", () => {
  let patientId, doctorId, reportId, sharedReportId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const patient = await User.create({
      name: "Patient Test",
      email: "patient@abc.com",
      password: "12345678",
      role: "patient"
    });
    patientId = patient._id;

    const doctor = await User.create({
      name: "Doctor Test",
      email: "doctor@abc.com",
      password: "12345678",
      role: "doctor"
    });
    doctorId = doctor._id;

    const report = await Report.create({
      user: patientId,
      reportPath: "/reports/testreport.pdf"
    });
    reportId = report._id;

    const sharedReport = await SharedReport.create({
      patient_id: patientId,
      doctor_id: doctorId,
      report_id: reportId,
      doctor_review: "Excellent report",
      viewedByDoctor: true
    });
    sharedReportId = sharedReport._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return empty array if patient has no shared reports", async () => {
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    let statusCode, data;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await getUserReportsWithFeedback(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").that.is.empty;
  });

  it("should return shared reports with doctor and report info", async () => {
    const req = { user: { id: patientId } };
    let statusCode, data;

    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (d) => { data = d; }
    };

    await getUserReportsWithFeedback(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;
    expect(data[0]).to.have.property("doctor_id");
    expect(data[0]).to.have.property("report_id");
    expect(data[0].doctor_id).to.have.property("name");
    expect(data[0].report_id).to.have.property("reportPath");
  });
});

