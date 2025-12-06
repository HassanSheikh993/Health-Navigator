import { expect } from "chai";
import mongoose from "mongoose";
import { updateProfile,loginUserData } from "../controller/userController.js";
import { User } from "../model/userModel.js";

describe("updateProfile", () => {
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create({
      email: "testuser@example.com",
      country: "Existing Country",
      city: "Existing City",
      contactNumber: "1234567890",
      specialization: "Cardiology",
      description: "Test Description",
      picture: "/uploadProfileImages/existing.png"
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should update user profile fields successfully", async () => {
    const req = {
      body: {
        email: "testuser@example.com",
        country: "New Country",
        city: "New City",
        contactNumber: "0987654321",
        specialization: "Neurology",
        description: "Updated Description"
      }
    };

    let statusCode, message;
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await updateProfile(req, res);

    expect(statusCode).to.equal(200);
    expect(message).to.equal("Profile updated successfully");
  });

  it("should return 404 if user not found", async () => {
    const req = {
      body: {
        email: "nonexistent@example.com",
        country: "New Country"
      }
    };

    let statusCode, message;
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await updateProfile(req, res);

    expect(statusCode).to.equal(404);
    expect(message).to.equal("User not found or no changes made");
  });

  it("should update profile picture if file is provided", async () => {
    const req = {
      body: { email: "testuser@example.com" },
      file: { filename: "testimage.png" }
    };

    let statusCode, message;
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await updateProfile(req, res);

    expect(statusCode).to.equal(200);
    expect(message).to.equal("Profile updated successfully");
  });

  it("should update only provided fields", async () => {
    const req = {
      body: {
        email: "testuser@example.com",
        city: "Updated City Only"
      }
    };

    let statusCode, message;
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { message = data.message; }
    };

    await updateProfile(req, res);

    expect(statusCode).to.equal(200);
    expect(message).to.equal("Profile updated successfully");
  });
});





describe("loginUserData", () => {
  let userId;

  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");

    const user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "12345678",
      role: "patient",
    });

    userId = user._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return user data excluding password", async () => {
    const req = { user: { id: userId } };
    let data, statusCode;

    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (d) => {
        data = d;
      },
    };

    await loginUserData(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.have.property("name", "Test User");
    expect(data).to.have.property("email", "testuser@example.com");
    expect(data.password).to.be.undefined; // ✅ Updated assertion
  });

  it("should return empty array if user not found", async () => {
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    let data, statusCode;

    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (d) => {
        data = d;
      },
    };

    await loginUserData(req, res);

    expect(statusCode).to.equal(200);
    expect(data).to.be.an("array").that.is.empty;
  });
});
