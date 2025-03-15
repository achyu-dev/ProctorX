import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionRenderer from "./QuestionRender";
import Sidebar from "./Sidebar";
import "../styles/assessment.css";

const Assessment = () => {
  const [readyTest, setReadyTest] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [warningVisible, setWarningVisible] = useState(false);
  const [remainingWarnings, setRemainingWarnings] = useState(2);
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();
  const testDuration = 7200; // 2 hours in seconds

  // Fetch questions
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

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle test submission
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
      .then((res) => res.json())
      .then(() => {
        alert("Test submitted successfully!");
        navigate("/");
      })
      .catch((err) => console.error("Error submitting test:", err));
  };

  // Auto-submit on time up
  const handleTimeUp = () => {
    alert("Time is up! Auto-submitting test.");
    handleSubmit();
  };

  // Show warning if cheating is detected
  const showWarning = () => {
    if (remainingWarnings > 0) {
      setWarningVisible(true);
      setRemainingWarnings((prev) => prev - 1);
      if (remainingWarnings === 1) handleSubmit(); // Auto-submit if last warning
    }
  };

  // Prevent cheating + force fullscreen
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
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
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

    // Block right-click, shortcuts & visibility change
    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("keydown", preventActions);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) showWarning();
    });

    enterFullScreen(); // Force fullscreen at start

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
      document.removeEventListener("keydown", preventActions);
      document.removeEventListener("visibilitychange", () => {
        if (document.hidden) showWarning();
      });
    };
  }, [remainingWarnings]);

  //Format timer
  const Timer = ({ duration, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(timer);
            onTimeUp();
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [onTimeUp]);

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(secs).padStart(2, "0")}`;
    };

    return (
      <div className="timer-display">Time Left: {formatTime(timeLeft)}</div>
    );
  };

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
