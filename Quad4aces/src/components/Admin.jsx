import React, { useState } from 'react';
import '../css/admin.css';

const Admin = () => {
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            if (editingIndex !== null) {
                const updatedQuestions = [...questions];
                updatedQuestions[editingIndex] = { question, answers };
                setQuestions(updatedQuestions);
                setEditingIndex(null);
            } else {
                setQuestions([...questions, { question, answers }]);
            }
            setQuestion('');
            setAnswers([]);
        }
    };

    const handleEdit = (index) => {
        setQuestion(questions[index].question);
        setAnswers(questions[index].answers);
        setEditingIndex(index);
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1 className="admin-header">Admin Page</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Question Input */}
                    <div>
                        <label className="block text-gray-700 mb-1">Add New Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="admin-input"
                            placeholder="Enter your question..."
                        />
                    </div>
                    <div className="flex space-x-4">
                        {/* Answer Inputs */}
                        {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((label, index) => (
                            <div key={index}>
                                <label className="block text-gray-700 mb-1">{label}</label>
                                <input
                                    type="text"
                                    value={answers[index] || ''}
                                    onChange={(e) => {
                                        const newAnswers = [...answers];
                                        newAnswers[index] = e.target.value;
                                        setAnswers(newAnswers);
                                    }}
                                    className="admin-input"
                                    placeholder={`Enter ${label.toLowerCase()}...`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button type="submit" className="admin-button">
                            {editingIndex !== null ? 'Save Question' : 'Add Question'}
                        </button>
                    </div>
                </form>

                {/* Questions List */}
                <h2 className="question-list-header">Questions List</h2>
                <ul className="list-disc pl-5 mt-2">
                    {questions.map((q, index) => (
                        <li key={index} className="text-gray-800 py-1">
                            <div>
                                <strong>{index + 1}. {q.question}</strong>
                                <ul className="list-disc pl-5 mt-2">
                                    {q.answers.map((a, i) => (
                                        <li key={i} className="text-gray-800 py-1">
                                            {String.fromCharCode(97 + i)}. {a}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={() => handleEdit(index)} className="admin-button">
                                    Edit
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Admin;
