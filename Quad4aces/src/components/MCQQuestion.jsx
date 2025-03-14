import React, { useState, useEffect } from "react";
import "../styles/mcq.css";
const MCQQuestion = ({ questionData, onAnswerUpdate }) => {
  const { id, questionText, options, student_answer } = questionData;
  const [selectedOption, setSelectedOption] = useState(student_answer || "");

  useEffect(() => {
    // If the parent's student_answer changes externally, update here
    setSelectedOption(student_answer || "");
  }, [student_answer]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    onAnswerUpdate(id, e.target.value);
  };

  return (
    <div className="mcq-question">
      <h3>{questionText}</h3>
      {options
      .filter(option => option.trim() !== "") // Remove empty options
      .map((option, i) => (
        <label key={i}>
          <input
            type="radio"
            name={`question-${id}`}
            value={option}
            checked={selectedOption === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default MCQQuestion;
