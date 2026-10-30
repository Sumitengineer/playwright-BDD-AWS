const { spawn } = require("node:child_process");
const { access } = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("@playwright/test");
const nodemailer = require("nodemailer");

const reportDirectory = path.resolve("playwright-report");
const reportPath = path.join(reportDirectory, "index.html");
const pdfPath = path.join(reportDirectory, "playwright-report.pdf");

async function sendReport() {
  const password = process.env.SMTP_PASSWORD ?? ""; // Dont commit this password in public repos. keep it "" .
  if (!password) {
    throw new Error(
      "Email report delivery is enabled, but SMTP_PASSWORD is not set.",
    );
  }

  await access(reportPath);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(reportPath).href, { waitUntil: "networkidle" });
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
  } finally {
    await browser.close();
  }

  const host = process.env.SMTP_HOST ?? "smtp.mail.yahoo.com";
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER ?? "engineer_sumit@yahoo.com";
  const to = process.env.REPORT_EMAIL_TO ?? "Sumit.engineer@gmail.com";
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid TCP port.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject: `Playwright test report - ${new Date().toLocaleString()}`,
    text: "The Playwright test run report is attached in HTML and PDF formats.",
    attachments: [
      { filename: "playwright-report.html", path: reportPath },
      { filename: "playwright-report.pdf", path: pdfPath },
    ],
  });

  console.log(`Playwright HTML and PDF reports emailed to ${to}.`);
}

const testProcess = spawn(
  process.execPath,
  [require.resolve("@playwright/test/cli"), "test", ...process.argv.slice(2)],
  { stdio: "inherit" },
);

testProcess.on("error", (error) => {
  console.error("Could not start Playwright:", error);
  process.exitCode = 1;
});

testProcess.on("close", async (code) => {
  const testExitCode = code ?? 1;
  let emailFailed = false;

  if (process.env.EMAIL_REPORT_ENABLED?.toLowerCase() === "false") {
    console.log("Email report delivery disabled by EMAIL_REPORT_ENABLED.");
  } else {
    try {
      await sendReport();
    } catch (error) {
      emailFailed = true;
      console.error("Playwright report email delivery failed:", error);
    }
  }

  process.exitCode = testExitCode || (emailFailed ? 1 : 0);
});
