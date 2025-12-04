// runLiverPrediction.js (FINAL & CLEAN)
import { spawn } from "child_process";
import path from "path";

export const runLiverPrediction = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const scriptPath = path.resolve("AI_Model/predict_liver.py");

      const py = spawn("python", [scriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let output = "";
      let errorOutput = "";

      py.stdout.on("data", (chunk) => (output += chunk.toString()));
      py.stderr.on("data", (chunk) => (errorOutput += chunk.toString()));

      py.on("close", () => {
        if (errorOutput.trim()) return reject("Python Error: " + errorOutput);

        try {
          resolve(JSON.parse(output));
        } catch {
          reject("Invalid JSON from Python: " + output);
        }
      });

      py.stdin.write(JSON.stringify(data));
      py.stdin.end();
    } catch (e) {
      reject("Node error: " + e.message);
    }
  });
};
