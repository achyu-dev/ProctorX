import React, { useState, useEffect } from "react";

const SubjectiveQuestion = ({ questionData, currentAnswer, onAnswerUpdate }) => {
  const { id, questionText } = questionData;
  const [text, setText] = useState(currentAnswer || "");

  useEffect(() => {
    setText(currentAnswer || "");
  }, [currentAnswer]);

  const handleChange = (e) => {
    setText(e.target.value);
    onAnswerUpdate(id, e.target.value);
  };

  return (
    <div className="subjective-question">
      <h3>{questionText}</h3>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type your answer here..."
        rows="10"
        cols="50"
      />
    </div>
  );
};

export default SubjectiveQuestion;