import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../AddDocument.css";

const API_URL =
  "https://document-expiry-tracker-s5f3.onrender.com";

function EditDocument() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const document = response.data;

      setTitle(document.title);
      setCategory(document.category);

      const formattedDate =
        new Date(document.expiryDate)
          .toISOString()
          .split("T")[0];

      setExpiryDate(formattedDate);

    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to load document"
        );

        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_URL}/api/documents/${id}`,
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

  if (loading) {
    return (
      <div className="add-page">
        <div className="add-card">
          <h2>Loading document...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="add-page">

      <div className="add-card">

        <h1>
          Document Expiry Tracker
        </h1>

        <h2>
          Edit Document
        </h2>

        <form onSubmit={handleSubmit}>

          <label>
            Document Name
          </label>

          <input
            type="text"
            placeholder="Enter document name"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          >

            <option value="">
              Select category
            </option>

            <option value="Identity">
              Identity
            </option>

            <option value="Education">
              Education
            </option>

            <option value="Vehicle">
              Vehicle
            </option>

            <option value="Insurance">
              Insurance
            </option>

            <option value="Work">
              Work
            </option>

            <option value="Other">
              Other
            </option>

          </select>

          <label>
            Expiry Date
          </label>

          <input
            type="date"
            value={expiryDate}
            onChange={(e) =>
              setExpiryDate(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="add-btn"
          >
            Update Document
          </button>

        </form>

        <button
          className="back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default EditDocument;