import React, { useState, useEffect } from "react";
import QuestionRenderer from "./QuestionRender.jsx"; // Import your component

const Assessment = () => {
    const [timeLeft, setTimeLeft] = useState(5); // Countdown before the test starts
    const [showQuestions, setShowQuestions] = useState(false); // Control when to show questions

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else {
            setShowQuestions(true); // Show questions when timer reaches 0
        }
    }, [timeLeft]);

    const studentDetails = {
        name: "John Doe",
        email: "john.doe@example.com",
        grade: "10th Grade",
        examName: "Math Assessment",
    };

    return (
        <div style={{ padding: "20px" }}>
            {!showQuestions ? (
                <>
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                        <div style={{ flex: 1, paddingRight: "20px" }}>
                            <h2>Student Details</h2>
                            <p><strong>Name:</strong> {studentDetails.name}</p>
                            <p><strong>Email:</strong> {studentDetails.email}</p>
                            <p><strong>Grade:</strong> {studentDetails.grade}</p>
                            <p><strong>Exam Name:</strong> {studentDetails.examName}</p>
                        </div>
                        <div style={{ flex: 2 }}>
                            <h2>Assessment Countdown</h2>
                            <p>The assessment will start in: <strong>{timeLeft}</strong> seconds</p>
                        </div>
                    </div>
                </>
            ) : (
                <QuestionRenderer /> // Show questions after countdown ends
            )}
        </div>
    );
};

export default Assessment;
