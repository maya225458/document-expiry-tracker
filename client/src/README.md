# Document Expiry Tracker

## Project Overview

Document Expiry Tracker is a MERN stack web application that helps users maintain a record of important documents and their expiry dates.

The application allows users to securely register and log in, add documents, view their documents, update document details, delete documents, and search or filter their documents.

The system also automatically identifies documents as Active, Expiring Soon, or Expired based on their expiry date.

## Technologies Used

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv

## Main Features

- User registration
- User login
- Password hashing
- JWT-based authentication
- Add documents
- View documents
- Edit documents
- Delete documents
- Search documents
- Filter documents by category
- Automatic expiry status
- Dashboard statistics
- Responsive design

## Document Status

The application calculates the document status based on the expiry date:

- **Active** – Document has more than 30 days remaining.
- **Expiring Soon** – Document expires within 30 days.
- **Expired** – Document expiry date has passed.

## Project Structure

```text
document-expiry-tracker/
│
├── client/
│   └── React frontend
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md