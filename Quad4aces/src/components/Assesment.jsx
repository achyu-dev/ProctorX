import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionRenderer from "./QuestionRender";
import Sidebar from "./Sidebar";
import Timer from "./Timer";
import "../styles/assessment.css";
//import useGlobalStore from "../store";

const Assessment = () => {
  const [readyTest, setReadyTest] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [warningVisible, setWarningVisible] = useState(false);
  const [remainingWarnings, setRemainingWarnings] = useState(2);
  const [currentTime, setCurrentTime] = useState("");
  const [riskScore, setRiskScore] = useState(0); // Live Risk Score
  const navigate = useNavigate();
  const testDuration = 7200; // 2 hours in seconds

  // Force full screen
  // const setFullscreen = useGlobalStore((state) => state.setFullscreen);
  // const isFullscreen = useGlobalStore((state) => state.isFullscreen);

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
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
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
      setRemainingWarnings((prev) => prev - 1);
      if (remainingWarnings === 1) handleSubmit();
    }
  };

  useEffect(() => {
    let mouseMovements = 0;
    let keyPresses = 0;
    let lastMouseTime = Date.now();
    let lastKeyTime = Date.now();

    const trackMouse = () => {
      const now = Date.now();
      if (now - lastMouseTime < 100) {
        mouseMovements += 1;
      }
      lastMouseTime = now;
    };

    const trackKeyPress = () => {
      const now = Date.now();
      if (now - lastKeyTime < 50) {
        keyPresses += 1;
      }
      lastKeyTime = now;
    };

    const calculateRiskScore = () => {
      let score = 0;
      if (mouseMovements > 10) score += 10;
      if (keyPresses > 20) score += 15;
      setRiskScore(score);

      fetch("http://localhost:3000/api/update-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riskScore: score }),
      });

      if (score >= 30) {
        alert("Suspicious activity detected! You are being logged out.");
        navigate("/");
      }

      mouseMovements = 0;
      keyPresses = 0;
    };

    document.addEventListener("mousemove", trackMouse);
    document.addEventListener("keydown", trackKeyPress);
    const interval = setInterval(calculateRiskScore, 5000);

    return () => {
      document.removeEventListener("mousemove", trackMouse);
      document.removeEventListener("keydown", trackKeyPress);
      clearInterval(interval);
    };
  }, [navigate]);

  useEffect(() => {
    const enterFullScreen = () => {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
      }
    };

    const checkFullscreen = () => {
      if (!document.fullscreenElement) {
        showWarning();
        enterFullScreen();
      }
    };

    const preventActions = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        const blockedKeys = ["c", "v", "x", "a", "u", "i", "s", "p", "T", "F5"];
        if (blockedKeys.includes(event.key)) {
          event.preventDefault();
          showWarning();
        }
      }
      if (event.key === "Escape" || event.altKey) {
        event.preventDefault();
        showWarning();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        showWarning();
      }
    };

    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keydown", preventActions);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    enterFullScreen();

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
      document.removeEventListener("keydown", preventActions);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [remainingWarnings]);

  return (
    <div className="assessment-container">
      {warningVisible && (
        <div className="warning-modal">
          <h2>Warning!</h2>
          <p>
            Suspicious activity detected! {remainingWarnings} warnings left.
          </p>
          <button onClick={() => setWarningVisible(false)}>OK</button>
        </div>
      )}

      <div className="assessment-header">
        <Timer duration={testDuration} onTimeUp={handleTimeUp} />
        <p>Risk Score: {riskScore}</p>
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
            onAnswerUpdate={(id, answer) =>
              setAnswersMap((prev) => ({ ...prev, [id]: answer }))
            }
          />
        )}
      </div>

      <div className="assessment-footer">
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
          disabled={currentQuestionIndex === 0}
        >
          Back
        </button>
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, readyTest.length - 1)
            )
          }
          disabled={currentQuestionIndex === readyTest.length - 1}
        >
          Next
        </button>
        <button onClick={handleSubmit}>Submit Test</button>
      </div>
    </div>
  );
};


export default Assessment;