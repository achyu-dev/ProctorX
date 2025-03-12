import React, { useState, useEffect } from 'react';

const Assessment = () => {
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    const studentDetails = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        grade: '10th Grade',
        examName: 'Math Assessment'
    };

    return (
        <div style={{ display: 'flex', padding: '20px' }}>
            <div style={{ flex: 1, paddingRight: '20px' }}>
                <h2>Student Details</h2>
                <p><strong>Name:</strong> {studentDetails.name}</p>
                <p><strong>Email:</strong> {studentDetails.email}</p>
                <p><strong>Grade:</strong> {studentDetails.grade}</p>
                <p><strong>Exam Name:</strong> {studentDetails.examName}</p>
            </div>
            <div style={{ flex: 2 }}>
                <h2>Assessment Countdown</h2>
                <p>The assessment will start in: {timeLeft} seconds</p>
            </div>
        </div>
    );
};

export default Assessment;