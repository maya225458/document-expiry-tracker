const express = require("express");

const {
  addDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addDocument);

router.get("/", protect, getDocuments);

router.get("/:id", protect, getDocument);

router.put("/:id", protect, updateDocument);

router.delete("/:id", protect, deleteDocument);

module.exports = router;