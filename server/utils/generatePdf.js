import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

function getChromePath() {
  const paths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }

  throw new Error("Chrome not found");
}

export async function generateMedicalPdf(html) {
  const browser = await puppeteer.launch({
    executablePath: getChromePath(),
    headless: true,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "40px",
      bottom: "40px",
      left: "25px",
      right: "25px",
    }
  });

  await browser.close();
  return pdf;
}

