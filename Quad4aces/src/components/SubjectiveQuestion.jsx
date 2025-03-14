import React, { useState, useEffect } from "react";

const SubjectiveQuestion = ({ questionData, onAnswerUpdate }) => {
  const { id, questionText, student_answer } = questionData;
  const [text, setText] = useState(student_answer || "");

  useEffect(() => {
    setText(student_answer || "");
  }, [student_answer]);

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
      />
    </div>
  );
};

export default SubjectiveQuestion;
