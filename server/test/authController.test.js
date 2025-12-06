import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "../model/userModel.js";
import { loginUser,logoutUser} from "../controller/authController.js";


describe("loginUser", () => {
  
  before(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.create({
      name: "Test User",
      email: "test@abc.com",
      password: "12345678",
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should return 400 if data is incomplete", async () => {
    let statusCode, message;

    const req = { body: { email: "abc@gmail.com" } };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        message = data.message;
      }
    };

    await loginUser(req, res, () => {});

    expect(statusCode).to.equal(400);
    expect(message).to.equal("Incomplete Data");
  });

  it("should return 404 if user not found", async () => {
    let statusCode, message;

    const req = { body: { email: "notfound@test.com", password: "12345678" } };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        message = data.message;
      }
    };

    await loginUser(req, res, () => {});

    expect(statusCode).to.equal(404);
    expect(message).to.equal("user not found");
  });

  it("should return 401 if password is incorrect", async () => {
    let statusCode, message;

    const req = { body: { email: "test@abc.com", password: "wrongpass" } };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        message = data.message;
      }
    };

    await loginUser(req, res, () => {});

    expect(statusCode).to.equal(401);
    expect(message).to.equal("Incorrect Password");
  });

  it("should login successfully with correct credentials", async () => {
    let message;
    const req = { body: { email: "test@abc.com", password: "12345678" } };
    const res = {
      cookie: () => {},
      json: (data) => {
        message = data.message;
      },
    };

    await loginUser(req, res, () => {});

    expect(message).to.equal("Login successful");
  });

});


describe("logoutUser", () => {
  it("should clear the token cookie and return success message", () => {
    let cookieCleared = false;
    let statusCode, responseData;

    const res = {
      clearCookie: (name, options) => {
        if (name === "token" && options.path === "/") cookieCleared = true;
        return res;
      },
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; }
    };

    logoutUser({}, res);

    expect(cookieCleared).to.be.true;
    expect(statusCode).to.equal(200);
    expect(responseData).to.deep.equal({ message: 'Logged out successfully', status: true });
  });
});

