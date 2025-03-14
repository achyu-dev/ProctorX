import React, { useState, useEffect } from "react";

const TrueFalseQuestion = ({ questionData, onAnswerUpdate }) => {
  const { id, questionText, student_answer } = questionData;
  const [selected, setSelected] = useState(student_answer || "");

  useEffect(() => {
    setSelected(student_answer || "");
  }, [student_answer]);

  const handleChange = (value) => {
    setSelected(value);
    onAnswerUpdate(id, value);
  };

  return (
    <div className="truefalse-question">
      <h3>{questionText}</h3>
      <label>
        <input
          type="radio"
          name={`question-${id}`}
          value="True"
          checked={selected === "True"}
          onChange={() => handleChange("True")}
        />
        True
      </label>
      <label>
        <input
          type="radio"
          name={`question-${id}`}
          value="False"
          checked={selected === "False"}
          onChange={() => handleChange("False")}
        />
        False
      </label>
    </div>
  );
};

export default TrueFalseQuestion;
