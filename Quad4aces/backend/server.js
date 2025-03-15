const express = require("express");
const { json } = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
//nst requestIp = require("request-ip");
const app = express();

const server = http.createServer(app); // Use http server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your frontend URL
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;  
const SOCKET_PORT = 3001;


// ✅ Allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Update this with your frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(json());

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const upload = multer({ dest: uploadDir });

// Path to store processed test data
const processedTestsPath = "processed_tests.json";

// Update risk score in json
const riskScoresPath = path.join(__dirname, "score.json");

if (!fs.existsSync(riskScoresPath)) {
  fs.writeFileSync(riskScoresPath, JSON.stringify({ score: 0 }, null, 2));
}

// Function to extract text from PDF
async function extractTextFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Function to parse questions from extracted text
function parseQuestions(text) {
  console.log("\n📄 Extracted PDF Content:\n", text); // ✅ PRINT extracted text in console

  const questionBlocks = text.split(/Q\d+:/).slice(1);
  const questions = [];

  questionBlocks.forEach((block) => {
    const lines = block
      .trim()
      .split("\n")
      .map((line) => line.trim());

    let questionText = lines[0];
    let type = lines
      .find((line) => line.startsWith("Type:"))
      ?.split("Type:")[1]
      ?.trim();
    let options = [];
    let answer = null;

    if (type === "MCQ") {
      let optionsStartIndex =
        lines.findIndex((line) => line.startsWith("Options:")) + 1;
      let answerIndex = lines.findIndex((line) => line.startsWith("Answer:"));

      if (optionsStartIndex > 0 && answerIndex > 0) {
        for (let i = optionsStartIndex; i < answerIndex; i++) {
          options.push(lines[i].trim());
        }
      }

      answer =
        answerIndex > 0
          ? lines[answerIndex]?.split("Answer:")[1]?.trim()
          : null;
    } else if (type === "Subjective") {
      answer = lines
        .find((line) => line.startsWith("Answer:"))
        ?.split("Answer:")[1]
        ?.trim();
    }

    questions.push({ questionText, type, options, answer });
  });

  return questions;
}

// Function to shuffle questions
function shuffleQuestions(questions) {
  let shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ✅ Function to save processed data to JSON
function saveProcessedData(filename, questions) {
  let existingData = [];

  // Check if file exists and is not empty
  if (
    fs.existsSync(processedTestsPath) &&
    fs.statSync(processedTestsPath).size > 0
  ) {
    try {
      const rawData = fs.readFileSync(processedTestsPath, "utf-8");
      existingData = JSON.parse(rawData);
    } catch (error) {
      console.error("❌ Error reading JSON file:", error);
    }
  }

  // Append new data
  existingData.push({ filename, questions });

  // Write back to the file
  try {
    fs.writeFileSync(processedTestsPath, JSON.stringify(existingData, null, 2));
    console.log("✅ Processed Questions Saved in JSON!");
  } catch (error) {
    console.error("❌ Error writing JSON file:", error);
  }
}

// API Endpoint to upload, process, and store PDF data
app.post("/upload", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("✅ File received:", req.file.originalname);

  try {
    const pdfPath = path.resolve(req.file.path);
    const text = await extractTextFromPDF(pdfPath);
    let questions = parseQuestions(text);
    questions = shuffleQuestions(questions);

    // ✅ Save processed questions to JSON file
    saveProcessedData(req.file.originalname, questions);

    // Delete uploaded file after processing
    fs.unlinkSync(pdfPath);

    res.json({ questions });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    res.status(500).json({ error: "Error processing PDF" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint to fetch processed questions
app.get("/api/questions", (req, res) => {
  const filePath = path.join(__dirname, "processed_tests.json");

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: "Processed questions not found" });
  }
});

// Endpoint to fetch ready test data
app.get("/api/ready-test", (req, res) => {
  // Assuming ready_test.json is saved at the project root (adjust the path as needed)
  const filePath = path.join(__dirname, "ready_test.json");

  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      // If the file content is an array of questions, return it directly
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("❌ Error reading ready_test.json:", error);
      res.status(500).json({ error: "Error processing ready test data" });
    }
  } else {
    res.status(404).json({ error: "Ready test not found" });
  }
});

const studentAnswersPath = path.join(__dirname, "student_answered.json");

app.post("/api/submit-test", (req, res) => {
  const submittedData = req.body;

  fs.writeFile(
    studentAnswersPath,
    JSON.stringify(submittedData, null, 2),
    (err) => {
      if (err) {
        console.error("Error saving test answers:", err);
        return res.status(500).json({ message: "Error saving answers" });
      }
      res.status(200).json({ message: "Test submitted successfully" });
    }
  );
});

// Endpoint to update risk score
app.post("/api/update-risk", (req, res) => {
  const { riskScore } = req.body;
  fs.writeFileSync(
    riskScoresPath,
    JSON.stringify({ score: riskScore }, null, 2)
  );
  res.json({ message: "Risk score updated successfully" });
});

// Endpoint to fetch risk score (optional)
app.get("/api/get-risk-score", (req, res) => {
  if (fs.existsSync(riskScoresPath)) {
    try {
      const rawData = fs.readFileSync(riskScoresPath, "utf-8");
      const riskScoreData = JSON.parse(rawData);
      return res.status(200).json(riskScoreData);
    } catch (error) {
      console.error("❌ Error reading risk score JSON:", error);
      return res.status(500).json({ message: "Error retrieving risk score" });
    }
  } else {
    return res.status(404).json({ message: "No risk score data found" });
  }
});

// VPN and Proxy check
const requestIp = require("request-ip");
const axios = require("axios");

// API Endpoint to detect VPN or Proxy
app.get("/api/check-vpn-proxy", async (req, res) => {
  const clientIp = requestIp.getClientIp(req); // Get user's IP

  if (!clientIp) {
    return res.status(500).json({ error: "Unable to retrieve IP address" });
  }

  try {
    const response = await axios.get(
      `https://proxycheck.io/v2/${clientIp}?vpn=1`
    );
    const data = response.data[clientIp];

    if (data.proxy === "yes" || data.vpn === "yes") {
      return res.json({ vpnDetected: true, proxyDetected: true });
    }

    res.json({ vpnDetected: false, proxyDetected: false });
  } catch (error) {
    console.error("❌ Error detecting VPN/Proxy:", error);
    res.status(500).json({ error: "Error checking VPN/Proxy" });
  }
});

app.get("/api/get-risk-score", (req, res) => {
  const data = fs.readFileSync(riskScoresPath, "utf8");
  res.json(JSON.parse(data));
});


// Socket.io setup

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
server.listen(SOCKET_PORT, () => {
  console.log(`✅ Server running on port ${SOCKET_PORT}`);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));