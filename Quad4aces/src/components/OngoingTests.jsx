import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Adjust based on your file structure
import { collection, onSnapshot } from "firebase/firestore";
import "../styles/ongoingtests.css"; // Ensure CSS is applied

const OngoingTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    // ✅ Get the logged-in admin ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const adminId = user?.email;
    if (!adminId) {
      console.error("❌ No admin found. Please log in.");
      return;
    }

    // ✅ Listen to test list changes in real-time
    const testListRef = collection(db, "admins", adminId, "test_list");
    const unsubscribe = onSnapshot(testListRef, async (snapshot) => {
      const updatedTests = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const testId = doc.id;
          const studentListRef = collection(db, "tests", testId, "student_list");

          // ✅ Listen for student changes in real-time
          return new Promise((resolve) => {
            onSnapshot(studentListRef, (studentSnapshot) => {
              const students = studentSnapshot.docs.map((studentDoc) => ({
                email: studentDoc.id,
                riskScore: studentDoc.data().risk_score || "N/A",
                active: studentDoc.data().active ? "Active" : "Inactive",
              }));

              resolve({
                id: testId,
                name: testId, // Using test ID as name (modify if needed)
                status: doc.data().active ? "Ongoing" : "Active", // Modify if stored differently
                students,
              });
            });
          });
        })
      );

      setTests(updatedTests);
    });

    return () => unsubscribe(); // ✅ Cleanup listener when component unmounts
  }, []);

  return (
    <div className="tests-container">
      {tests.length > 0 ? (
        tests.map((test) => (
          <div key={test.id} className="test-card">
            <h3>{test.name}</h3>
            <p className={`status ${test.status.toLowerCase()}`}>
              Status: {test.status}
            </p>
            <h4>Registered Students:</h4>
            <ul>
              {test.students.length > 0 ? (
                test.students.map((student) => (
                  <li key={student.email}>
                    <strong>{student.email}</strong> - Risk Score: {student.riskScore} - Status: {student.active}
                  </li>
                ))
              ) : (
                <p>No students registered.</p>
              )}
            </ul>
          </div>
        ))
      ) : (
        <p>No ongoing tests available.</p>
      )}
    </div>
  );
};

export default OngoingTests;
