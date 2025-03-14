const express = require("express");
const { json } = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ✅ Allow requests from your frontend
app.use(cors({
    origin: "http://localhost:5173", // Update this with your frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
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

// Function to extract text from PDF
async function extractTextFromPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

// Function to parse questions from extracted text
function parseQuestions(text) {
    console.log("\n📄 Extracted PDF Content:\n", text);  // ✅ PRINT extracted text in console

    const questionBlocks = text.split(/Q\d+:/).slice(1);
    const questions = [];

    questionBlocks.forEach(block => {
        const lines = block.trim().split("\n").map(line => line.trim());

        let questionText = lines[0];
        let type = lines.find(line => line.startsWith("Type:"))?.split("Type:")[1]?.trim();
        let options = [];
        let answer = null;

        if (type === "MCQ") {
            let optionsStartIndex = lines.findIndex(line => line.startsWith("Options:")) + 1;
            let answerIndex = lines.findIndex(line => line.startsWith("Answer:"));

            if (optionsStartIndex > 0 && answerIndex > 0) {
                for (let i = optionsStartIndex; i < answerIndex; i++) {
                    options.push(lines[i].trim());
                }
            }

            answer = answerIndex > 0 ? lines[answerIndex]?.split("Answer:")[1]?.trim() : null;
        } else if (type === "Subjective") {
            answer = lines.find(line => line.startsWith("Answer:"))?.split("Answer:")[1]?.trim();
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
    if (fs.existsSync(processedTestsPath) && fs.statSync(processedTestsPath).size > 0) {
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
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
