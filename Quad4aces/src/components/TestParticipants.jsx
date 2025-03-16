import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const TestParticipants = ({ testId }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!testId) return;

    const participantsRef = collection(db, "tests", testId, "student_list");
    
    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      const fetchedParticipants = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: doc.id,
          loginTime: data.loginTime?.toDate().toLocaleString() || "N/A",
          logoutTime: data.logoutTime?.toDate().toLocaleString() || "N/A",
          riskScore: data.riskScore || "N/A",
        };
      });
      setParticipants(fetchedParticipants);
    });

    return () => unsubscribe();
  }, [testId]);

  return (
    <div className="participants-container">
      <h2>Test Participants</h2>
      {participants.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Risk Score</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <tr key={participant.id}>
                <td>{participant.email}</td>
                <td>{participant.loginTime}</td>
                <td>{participant.logoutTime}</td>
                <td>{participant.riskScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No participants have taken this test yet.</p>
      )}
    </div>
  );
};

export default TestParticipants;
