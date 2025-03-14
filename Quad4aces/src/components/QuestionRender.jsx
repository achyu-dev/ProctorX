import { useState, useEffect } from "react";
import axios from "axios";

// Component to render each question
const Question = ({ questionData, index }) => {
    const { questionText, type, options } = questionData;
    const [answer, setAnswer] = useState("");

    return (
        <div className="question-container">
            <h3>{index + 1}. {questionText}</h3>

            {type === "MCQ" && (
                <div>
                    {options.map((option, i) => (
                        <label key={i}>
                            <input 
                                type="radio" 
                                name={`q${index}`} 
                                value={option} 
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {type === "True/False" && (
                <div>
                    <label>
                        <input 
                            type="radio" 
                            name={`q${index}`} 
                            value="True" 
                            onChange={() => setAnswer("True")}
                        />
                        True
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name={`q${index}`} 
                            value="False" 
                            onChange={() => setAnswer("False")}
                        />
                        False
                    </label>
                </div>
            )}

            {type === "Subjective" && (
                <textarea 
                    placeholder="Type your answer here..." 
                    onChange={(e) => setAnswer(e.target.value)}
                />
            )}
        </div>
    );
};

// Main Component to Fetch and Display Questions
const QuestionRenderer = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/questions")
    .then(response => {
        if (Array.isArray(response.data)) {
            console.log("✅ Questions Fetched:", response.data.questions);
            setQuestions(response.data);
        } else {
            console.warn("⚠️ Unexpected API response:", response.data);
            setQuestions([]);
        }
    })
    .catch(error => {
        console.error("❌ API Error:", error);
        setQuestions([]); // Prevent crashes on error
    });
    }, []);
    

    return (
        <div className="quiz-container">
            <h2>Test Questions</h2>
            {questions.length > 0 ? (
                questions.map((q, index) => <Question key={index} questionData={q} index={index} />)
            ) : (
                <p>Loading questions...</p>
            )}
        </div>
    );
};

export default QuestionRenderer;
