import React from "react";
import MCQQuestion from "./MCQQuestion";
import SubjectiveQuestion from "./SubjectiveQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import "../styles/question.css";

const QuestionRenderer = ({ question, onAnswerUpdate }) => {
  if (!question) return null;

  const renderQuestion = () => {
    switch (question.type) {
      case "MCQ":
        return <MCQQuestion questionData={question} onAnswerUpdate={onAnswerUpdate} />;
      case "Subjective":
        return <SubjectiveQuestion questionData={question} onAnswerUpdate={onAnswerUpdate} />;
      case "True/False":
        return <TrueFalseQuestion questionData={question} onAnswerUpdate={onAnswerUpdate} />;
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="question-renderer">
      {renderQuestion()}
    </div>
  );
};

export default QuestionRenderer;
