import React, { useState, useEffect } from "react";
import QuestionRenderer from "./QuestionRender";
import Sidebar from "./Sidebar";
import Timer from "./Timer";
import "../styles/assessment.css";

const Assessment = () => {
  const [readyTest, setReadyTest] = useState([]); // Array of questions with id & student_answer fields
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({}); // Map keyed by question id
  const testDuration = 600; // Total time in seconds (e.g. 10 minutes)

  // Load ready test JSON when component mounts
  useEffect(() => {
    fetch("http://localhost:3000/api/ready-test")  // API that returns ready_test.json as an array of questions
      .then((res) => res.json())
      .then((data) => {
        // data should be an array with each question having a unique id and an empty student_answer field
        setReadyTest(data);
        // Optionally, initialize answersMap from data:
        const initialAnswers = {};
        data.forEach(q => {
          initialAnswers[q.id] = q.student_answer || "";
        });
        setAnswersMap(initialAnswers);
      })
      .catch((err) => console.error("Error fetching ready test:", err));
  }, []);

  // Handlers for navigating questions
  const handleNext = () => {
    if (currentQuestionIndex < readyTest.length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  // Handler to update student's answer for a question
  const handleAnswerUpdate = (questionId, answer) => {
    setAnswersMap(prev => ({ ...prev, [questionId]: answer }));
  };

  // When test is submitted (by button click or timer expiry)
  const handleSubmit = () => {
    const finalTest = readyTest.map(q => ({
      ...q,
      student_answer: answersMap[q.id] || ""
    }));
    // POST finalTest JSON to backend for storage in student_answered.json
    fetch("http://localhost:3000/api/submit-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalTest),
    })
      .then(res => res.json())
      .then(data => {
        alert("Test submitted successfully!");
        // Optionally, navigate away
      })
      .catch(err => console.error("Error submitting test:", err));
  };

  // Auto-submit when timer ends
  const handleTimeUp = () => {
    alert("Time is up! Auto-submitting test.");
    handleSubmit();
  };

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <Timer duration={testDuration} onTimeUp={handleTimeUp} />
      </div>
      <div className="assessment-body">
        <Sidebar 
          questions={readyTest} 
          answersMap={answersMap} 
          currentIndex={currentQuestionIndex} 
          setCurrentQuestionIndex={setCurrentQuestionIndex} 
        />
        {readyTest.length > 0 && (
          <QuestionRenderer
            question={readyTest[currentQuestionIndex]}
            onAnswerUpdate={handleAnswerUpdate}
          />
        )}
      </div>
      <div className="assessment-footer">
        <button onClick={handleBack} disabled={currentQuestionIndex === 0}>Back</button>
        <button onClick={handleNext} disabled={currentQuestionIndex === readyTest.length - 1}>Next</button>
        <button onClick={handleSubmit}>Submit Test</button>
      </div>
    </div>
  );
};

export default Assessment;
