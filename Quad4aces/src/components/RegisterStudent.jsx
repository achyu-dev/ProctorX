import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { app } from "../firebaseConfig"; // Ensure Firebase is initialized
import bcrypt from "bcryptjs";

const RegisterStudent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const db = getFirestore(app);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      // Check if email already exists
      const q = query(collection(db, "students"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("This email is already registered. Please use a different email.");
        return;
      }

      // Encrypt password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Add student to Firestore
      await addDoc(collection(db, "students"), {
        email,
        password: hashedPassword,
        testid: "1234",
        testname: "Test",
      });

      alert("Student registered successfully!");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering student. Please try again.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", width: "500px" }}>
        <div className="register">Student Registration</div>

        {/* Email Input */}
        <div className="email">
          <label style={{ marginRight: "10px" }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: "10px", padding: "8px" }}
            placeholder="Admin Email"
          />
        </div>

        {/* Password Input */}
        <div className="password">
          <label style={{ marginRight: "10px" }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: "10px", padding: "8px" }}
            placeholder="Password"
          />
        </div>

        {/* Register Button */}
        <button type="submit" style={{ padding: "8px", cursor: "pointer" }}>Register Student</button>
      </form>
    </div>
  );
};

export default RegisterStudent;
