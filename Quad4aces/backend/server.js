import express, { json } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import cors from "cors";
import { readFileSync, unlinkSync } from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(json());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Function to extract text from PDF
async function extractTextFromPDF(pdfPath) {
    const dataBuffer = readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

// Function to parse questions from extracted text
function parseQuestions(text) {
    const questionBlocks = text.split(/Q\d+:/).slice(1);
    const questions = [];

    questionBlocks.forEach(block => {
        const lines = block.trim().split("\n").map(line => line.trim());

        let questionText = lines[0];
        let type = lines.find(line => line.startsWith("Type:"))?.split("Type:")[1].trim();
        let options = [];
        let answer = null;

        if (type === "MCQ") {
            let optionsStartIndex = lines.findIndex(line => line.startsWith("Options:")) + 1;
            let answerIndex = lines.findIndex(line => line.startsWith("Answer:"));

            for (let i = optionsStartIndex; i < answerIndex; i++) {
                options.push(lines[i].trim());
            }

            answer = lines[answerIndex]?.split("Answer:")[1].trim();
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

// API Endpoint to upload and process PDF
app.post("/upload", upload.single("pdf"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");

    try {
        const text = await extractTextFromPDF(req.file.path);
        let questions = parseQuestions(text);
        questions = shuffleQuestions(questions);

        // Delete uploaded file after processing
        unlinkSync(req.file.path);

        res.json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing PDF");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
