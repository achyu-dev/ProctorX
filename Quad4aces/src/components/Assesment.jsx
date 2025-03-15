import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionRenderer from "./QuestionRender";
import Sidebar from "./Sidebar";
import Timer from "./Timer";
import "../styles/assessment.css";

const Assessment = () => {
  const [readyTest, setReadyTest] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [warningVisible, setWarningVisible] = useState(false);
  const [remainingWarnings, setRemainingWarnings] = useState(2);
  const testDuration = 7200; // 2 hours
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/ready-test")
      .then((res) => res.json())
      .then((data) => {
        setReadyTest(data);
        const initialAnswers = {};
        data.forEach((q) => {
          initialAnswers[q.id] = q.student_answer || "";
        });
        setAnswersMap(initialAnswers);
      })
      .catch((err) => console.error("Error fetching ready test:", err));
  }, []);

  useEffect(() => {
    const enterFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(console.error);
      }
    };
    enterFullScreen();
  }, []);

  const handleSubmit = () => {
    const finalTest = readyTest.map((q) => ({
      ...q,
      student_answer: answersMap[q.id] || "",
    }));
    fetch("http://localhost:3000/api/submit-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalTest),
    })
      .then(() => {
        alert("Test submitted successfully!");
        navigate("/");
      })
      .catch((err) => console.error("Error submitting test:", err));
  };

  const handleTimeUp = () => {
    alert("Time is up! Auto-submitting test.");
    handleSubmit();
  };

  const showWarning = () => {
    if (remainingWarnings > 0) {
      setWarningVisible(true);
      setRemainingWarnings((prev) => Math.max(prev - 1, 0));
      if (remainingWarnings === 1) handleSubmit();
    }
  };

  useEffect(() => {
    const preventActions = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        const blockedKeys = ["c", "v", "x", "a", "u", "i", "s", "p", "T", "F5"];
        if (blockedKeys.includes(event.key)) {
          event.preventDefault();
          showWarning();
        }
      }
    };

    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keydown", preventActions);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) showWarning();
    });

    return () => {
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
      document.removeEventListener("keydown", preventActions);
      document.removeEventListener("visibilitychange", () => {
        if (document.hidden) showWarning();
      });
    };
  }, [remainingWarnings]);

  return (
    <div className="assessment-container" style={{ userSelect: "none" }}>
      {warningVisible && (
        <div className="warning-modal">
          <h2>Warning!</h2>
          <p>Suspicious activity detected! {remainingWarnings} warnings left.</p>
          <button onClick={() => setWarningVisible(false)}>OK</button>
        </div>
      )}
      <div className="assessment-header">
        <div className="time-display">
          Test Duration: {new Date(testDuration * 1000).toISOString().substr(11, 8)}
        </div>
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
          currentAnswer={answersMap[readyTest[currentQuestionIndex].id] || ""}
          onAnswerUpdate={(id, answer) => {
            setAnswersMap((prev) => {
              const updatedAnswers = { ...prev, [id]: answer };
              console.log("Updated Answers Map:", updatedAnswers); // ✅ Console log the updated state
              return updatedAnswers;
            });
          }}
        />
        )}
      </div>
      <div className="assessment-footer">
        <button onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))} disabled={currentQuestionIndex === 0}>
          Back
        </button>
        <button onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, readyTest.length - 1))} disabled={currentQuestionIndex === readyTest.length - 1}>
          Next
        </button>
        <button onClick={handleSubmit}>Submit Test</button>
      </div>
    </div>
  );
};

export default Assessment;