import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/documents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(response.data);
    } catch (error) {
      alert("Failed to load documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const difference =
      (expiry - today) / (1000 * 60 * 60 * 24);

    if (difference < 0) {
      return "Expired";
    }

    if (difference <= 30) {
      return "Expiring Soon";
    }

    return "Active";
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchDocuments();
    } catch (error) {
      alert("Failed to delete document");
    }
  };

  const startEdit = (document) => {
    setEditingId(document._id);
    setEditTitle(document.title);
    setEditCategory(document.category);
    setEditExpiryDate(
      new Date(document.expiryDate)
        .toISOString()
        .split("T")[0]
    );
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/documents/${id}`,
        {
          title: editTitle,
          category: editCategory,
          expiryDate: editExpiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);
      fetchDocuments();
    } catch (error) {
      alert("Failed to update document");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = document.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      document.category === category;

    return matchesSearch && matchesCategory;
  });

  const activeCount = documents.filter(
    (document) => getStatus(document.expiryDate) === "Active"
  ).length;

  const expiringCount = documents.filter(
    (document) =>
      getStatus(document.expiryDate) === "Expiring Soon"
  ).length;

  const expiredCount = documents.filter(
    (document) => getStatus(document.expiryDate) === "Expired"
  ).length;

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <div>
          <h1>Document Expiry Tracker</h1>
          <p>
            Welcome, <strong>{user?.name}</strong>
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <button
        className="add-btn"
        onClick={() => navigate("/add-document")}
      >
        + Add Document
      </button>

      <div className="stats">

        <div className="stat-card">
          <h3>Total Documents</h3>
          <p>{documents.length}</p>
        </div>

        <div className="stat-card">
          <h3>Active</h3>
          <p>{activeCount}</p>
        </div>

        <div className="stat-card">
          <h3>Expiring Soon</h3>
          <p>{expiringCount}</p>
        </div>

        <div className="stat-card">
          <h3>Expired</h3>
          <p>{expiredCount}</p>
        </div>

      </div>

      <div className="search-section">

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Identity">Identity</option>
          <option value="Education">Education</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Insurance">Insurance</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>

      </div>

      <div className="documents">

        {filteredDocuments.length === 0 ? (
          <div className="empty-message">
            <h3>No documents found</h3>
            <p>
              Add a document or change your search/filter.
            </p>
          </div>
        ) : (
          filteredDocuments.map((document) => {

            const status = getStatus(
              document.expiryDate
            );

            return (
              <div
                className="document-card"
                key={document._id}
              >

                {editingId === document._id ? (
                  <div className="edit-form">

                    <h3>Edit Document</h3>

                    <label>Document Name</label>

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(e.target.value)
                      }
                    />

                    <label>Category</label>

                    <select
                      value={editCategory}
                      onChange={(e) =>
                        setEditCategory(e.target.value)
                      }
                    >
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

                    <label>Expiry Date</label>

                    <input
                      type="date"
                      value={editExpiryDate}
                      onChange={(e) =>
                        setEditExpiryDate(e.target.value)
                      }
                    />

                    <button
                      onClick={() =>
                        handleUpdate(document._id)
                      }
                    >
                      Save Changes
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        setEditingId(null)
                      }
                    >
                      Cancel
                    </button>

                  </div>
                ) : (
                  <>
                    <h3>{document.title}</h3>

                    <p>
                      <strong>Category:</strong>{" "}
                      {document.category}
                    </p>

                    <p>
                      <strong>Expiry Date:</strong>{" "}
                      {new Date(
                        document.expiryDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status ${status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {status}
                      </span>
                    </p>

                    <div className="document-actions">

                      <button
                        onClick={() =>
                          startEdit(document)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(document._id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </>
                )}

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default Dashboard;