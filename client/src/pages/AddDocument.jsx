import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../AddDocument.css";

function AddDocument() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://document-expiry-tracker-s5f3.onrender.com/api/documents",
        {
          title,
          category,
          expiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Document added successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add document"
      );
    }
  };

  return (
    <div className="add-page">
      <div className="add-card">
        <h1>Document Expiry Tracker</h1>
        <h2>Add Document</h2>

        <form onSubmit={handleSubmit}>
          <label>Document Name</label>

          <input
            type="text"
            placeholder="Enter document name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="Identity">Identity</option>
            <option value="Education">Education</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Insurance">Insurance</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>

          <label>Expiry Date</label>

          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />

          <button type="submit" className="add-btn">
            Add Document
          </button>
        </form>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AddDocument;