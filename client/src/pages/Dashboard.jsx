import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

const API_URL =
  "https://document-expiry-tracker-s5f3.onrender.com";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to load documents"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const difference =
      Math.ceil(
        (expiry - today) / (1000 * 60 * 60 * 24)
      );

    if (difference < 0) {
      return "Expired";
    }

    if (difference <= 30) {
      return "Expiring Soon";
    }

    return "Active";
  };

  const getStatusClass = (status) => {
    if (status === "Expired") {
      return "expired";
    }

    if (status === "Expiring Soon") {
      return "expiring-soon";
    }

    return "active";
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
        `${API_URL}/api/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(
        documents.filter(
          (document) => document._id !== id
        )
      );

      alert("Document deleted successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete document"
      );
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-document/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const filteredDocuments = documents.filter(
    (document) => {
      const matchesSearch = document.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        document.category === categoryFilter;

      return matchesSearch && matchesCategory;
    }
  );

  const activeCount = documents.filter(
    (document) =>
      getStatus(document.expiryDate) === "Active"
  ).length;

  const expiringCount = documents.filter(
    (document) =>
      getStatus(document.expiryDate) ===
      "Expiring Soon"
  ).length;

  const expiredCount = documents.filter(
    (document) =>
      getStatus(document.expiryDate) === "Expired"
  ).length;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <h2>Loading documents...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}

        <div className="dashboard-header">
          <div>
            <h1>Document Expiry Tracker</h1>

            <p>
              Welcome,{" "}
              <strong>
                {user?.name || "User"}
              </strong>
            </p>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Summary Cards */}

        <div className="summary-container">

          <div className="summary-card">
            <h3>Total Documents</h3>
            <p>{documents.length}</p>
          </div>

          <div className="summary-card active-card">
            <h3>Active</h3>
            <p>{activeCount}</p>
          </div>

          <div className="summary-card warning-card">
            <h3>Expiring Soon</h3>
            <p>{expiringCount}</p>
          </div>

          <div className="summary-card danger-card">
            <h3>Expired</h3>
            <p>{expiredCount}</p>
          </div>

        </div>

        {/* Actions */}

        <div className="dashboard-actions">

          <button
            className="add-document-btn"
            onClick={() =>
              navigate("/add-document")
            }
          >
            + Add Document
          </button>

        </div>

        {/* Search and Filter */}

        <div className="filter-container">

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="All">
              All Categories
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

        </div>

        {/* Documents */}

        <div className="documents-section">

          <h2>My Documents</h2>

          {filteredDocuments.length === 0 ? (
            <div className="empty-state">

              <h3>
                No documents found
              </h3>

              <p>
                Add a document to start
                tracking expiry dates.
              </p>

              <button
                className="add-document-btn"
                onClick={() =>
                  navigate("/add-document")
                }
              >
                Add Your First Document
              </button>

            </div>
          ) : (
            <div className="document-list">

              {filteredDocuments.map(
                (document) => {

                  const status =
                    getStatus(
                      document.expiryDate
                    );

                  return (
                    <div
                      className="document-card"
                      key={document._id}
                    >

                      <div className="document-info">

                        <h3>
                          {document.title}
                        </h3>

                        <p>
                          <strong>
                            Category:
                          </strong>{" "}
                          {document.category}
                        </p>

                        <p>
                          <strong>
                            Expiry Date:
                          </strong>{" "}
                          {new Date(
                            document.expiryDate
                          ).toLocaleDateString()}
                        </p>

                        <span
                          className={`status ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                      </div>

                      <div className="document-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(
                              document._id
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              document._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;