const OngoingTests = () => {
    const tests = [
      { id: 1, name: "Math Test", status: "Active" },
      { id: 2, name: "Science Quiz", status: "Ongoing" },
    ];
  
    return (
      <div className="tests-container">
        {tests.map((test) => (
          <div key={test.id} className="test-card">
            <h3>{test.name}</h3>
            <p>Status: {test.status}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default OngoingTests;
  