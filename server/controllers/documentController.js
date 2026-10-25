const Document = require("../models/Document");

// Add a document
const addDocument = async (req, res) => {
  try {
    const { title, category, expiryDate } = req.body;

    const document = await Document.create({
      title,
      category,
      expiryDate,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Document added successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add document",
      error: error.message,
    });
  }
};

// Get all documents of logged-in user
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      userId: req.user.id,
    }).sort({ expiryDate: 1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get documents",
      error: error.message,
    });
  }
};

// Get one document
const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get document",
      error: error.message,
    });
  }
};

// Update document
const updateDocument = async (req, res) => {
  try {
    const { title, category, expiryDate } = req.body;

    const document = await Document.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        title,
        category,
        expiryDate,
      },
      {
        new: true,
      }
    );

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json({
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update document",
      error: error.message,
    });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
};

module.exports = {
  addDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
};