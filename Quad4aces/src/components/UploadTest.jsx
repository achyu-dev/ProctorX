import { useState } from "react";
import axios from "axios";
import "../styles/styles.css";

const UploadTest = () => {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setMessage("❌ Invalid file format. Please upload a PDF.");
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("❌ File size exceeds 5MB. Please upload a smaller file.");
      return;
    }

    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile)); // Generate preview URL
    setMessage(""); // Clear previous messages
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Upload successful! You can now edit the test.");
      setFileURL(null); // Clear preview after upload
    } catch (error) {
      setMessage("❌ Upload failed. Please check your network.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a Test</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      
      {/* Show preview only if a file is selected */}
      {fileURL && (
        <div className="pdf-preview">
          <iframe src={fileURL} width="100%" height="400px"></iframe>
        </div>
      )}

      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
};

export default UploadTest;
