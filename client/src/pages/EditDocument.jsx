import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditDocument() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getDocument = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const document = response.data;

        setTitle(document.title);
        setCategory(document.category);

        setExpiryDate(
          new Date(document.expiryDate)
            .toISOString()
            .split("T")[0]
        );
      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Failed to load document"
        );
      }
    };

    getDocument();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/documents/${id}`,
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

      alert("Document updated successfully!");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update document"
      );
    }
  };

  return (
    <div>
      <h1>Document Expiry Tracker</h1>

      <h2>Edit Document</h2>

      <form onSubmit={handleSubmit}>
        <label>Document Name</label>
        <br />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br />
        <br />

        <label>Category</label>
        <br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Identity">Identity</option>
          <option value="License">License</option>
          <option value="Insurance">Insurance</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>

        <br />
        <br />

        <label>Expiry Date</label>
        <br />

        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Update Document
        </button>
      </form>

      <br />

      <button onClick={() => navigate("/dashboard")}>
        Cancel
      </button>
    </div>
  );
}

export default EditDocument;