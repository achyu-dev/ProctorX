import React from "react";

const Sidebar = ({ questions, answersMap, currentIndex, setCurrentQuestionIndex }) => {
  return (
    <div className="sidebar">
      <h4>Questions</h4>
      <ul>
        {questions.map((q, index) => {
          // If answer exists for the question id, mark it as answered.
          const answered = answersMap[q.id] && answersMap[q.id] !== "";
          return (
            <li
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              style={{
                cursor: "pointer",
                backgroundColor: answered ? "lightgreen" : "transparent",
                fontWeight: currentIndex === index ? "bold" : "normal",
                padding: "5px",
                margin: "2px 0"
              }}
            >
              {index + 1}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
