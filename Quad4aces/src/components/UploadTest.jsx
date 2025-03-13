import { useState } from "react";
import axios from "axios";
import "../css/admin.css";

const UploadTest = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");
    
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Upload successful! You can now edit the test.");
    } catch (error) {
      setMessage("Upload failed.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a Test</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
      {message && <a href="/edit-test" className="edit-link">Edit Test</a>}
    </div>
  );
};

export default UploadTest;
