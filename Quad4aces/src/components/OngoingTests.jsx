import React from 'react';
import '../styles/ongoingtests.css'; // Ensure this is imported for the updated CSS

const OngoingTests = () => {
  const tests = [
    { id: 1, name: "Math Test", status: "Active" },
    { id: 2, name: "Science Quiz", status: "Ongoing" },
  ];

  return (
    <div className="tests-container">
      {tests.map((test) => (
        <div key={test.id} className="test-card">
          <h3 className='name'>{test.name}</h3>
          <p className={`status ${test.status.toLowerCase()}`}>
            Status: {test.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OngoingTests;

  