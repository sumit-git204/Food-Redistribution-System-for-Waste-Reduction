# 🍽️ SmartServe AI - Food Waste Reduction & Redistribution Platform

## Milestone 1: Inventory Management & Expiry Tracking System

SmartServe AI is a full-stack **AI-powered Food Waste Reduction & Redistribution Platform** designed to help restaurants, supermarkets, hotels, bakeries, and other food businesses minimize food waste through efficient inventory management and expiry monitoring.

**Milestone 1** focuses on building the **Inventory Management & Expiry Tracking System**, which enables businesses to securely manage inventory, monitor stock levels, track product expiry dates, scan barcodes/QR codes, import inventory through CSV files, and receive real-time expiry alerts.

---

# 🚀 Project Overview

Food waste is a significant global challenge caused by inefficient inventory management, over-purchasing, and the inability to identify surplus food before it expires.

This project aims to solve these problems by providing a centralized platform where businesses can:

- Manage food inventory efficiently
- Track product expiry dates
- Monitor low stock and expired products
- Import inventory in bulk using CSV
- Scan products using Barcode/QR
- Receive real-time expiry notifications
- Prepare inventory data for AI-based waste prediction (Future Milestones)

---

# 🌟 Features (Milestone 1)

## 🔐 Authentication & Authorization

- Secure JWT Authentication
- bcrypt Password Hashing
- Business Registration & Login
- Protected REST APIs
- Role-Based Authentication
  - Business (Implemented)
  - NGO (Future)
  - Admin (Future)

---

## 📦 Inventory Management

Complete CRUD Operations for Inventory

Each inventory item stores:

- Item Name
- Category
- Current Stock
- Minimum Stock
- Unit
- Supplier
- Manufacture Date
- Expiry Date
- Barcode / SKU
- Storage Condition
- Batch Number
- Notes

Features include:

- Create Inventory
- Update Inventory
- Delete Inventory
- Search Inventory
- Filter Inventory
- Quick Quantity (+ / -)
- Dynamic Status Calculation

Inventory Status:

- 🟢 Fresh
- 🟡 Low Stock
- 🟠 Expiring Soon
- 🔴 Expired

---

## 📂 Category Management

Predefined food categories with storage information.

Examples:

- Dairy & Eggs
- Bakery & Bread
- Fresh Produce
- Meat & Seafood
- Pantry Items
- Prepared Foods
- Beverages

Each category contains:

- Shelf Life
- Storage Type
- Perishability Level

---

## 📷 Barcode / QR Scanner

Inventory can be added quickly using an integrated scanner.

Features:

- Camera Scanner
- Image Upload Scanner
- Manual SKU Entry
- Auto-fill Barcode Field

Powered by:

- html5-qrcode

---

## 📄 Bulk CSV Upload

Businesses can upload inventory in bulk.

Features:

- Drag & Drop Upload
- CSV Validation
- Header Normalization
- Preview First 5 Rows
- Error Detection
- Sample CSV Download

Libraries Used:

- multer
- csv-parser

---

## 🚨 Expiry Alert System

Automatic monitoring of inventory.

Alerts Generated:

- Expired Products
- Expiring Soon
- Low Stock

Features:

- Alert Feed
- Filter Alerts
- Mark as Read
- Alert Banner

---

## 📊 Dashboard

Business Dashboard provides an overview of inventory.

Summary Cards

- Total Products
- Products Near Expiry
- Expired Products
- Low Stock Products
- Total Categories

Additional Widgets

- Recent Inventory
- Recent Alerts
- Expiry Alert Banner

---

## ✅ Validation

Frontend Validation

- Required Fields
- Date Validation
- Numeric Validation

Backend Validation

- Email Uniqueness
- Password Validation
- Non-negative Stock
- Expiry Date Validation
- Protected APIs
- Invalid CSV Detection

---

# 🛠 Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js, Vite, React Router, Context API, Tailwind CSS |
| Backend | Node.js, Express.js (MVC Architecture) |
| Database | MongoDB Atlas, Mongoose ODM |
| Authentication | JWT, bcryptjs |
| File Upload | Multer |
| CSV Parsing | csv-parser |
| Barcode Scanner | html5-qrcode |
| API Client | Axios |
| Date Utilities | date-fns |

---

# 📂 Repository Structure

```text
Food-Redistribution-System-for-Waste-Reduction/

│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── sample_inventory.csv
│
└── README.md
```

---

# 🏗 System Architecture

```text
                   React Frontend
                         │
                         │ Axios
                         ▼
              Express REST API Server
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
 Authentication     Inventory APIs     Alert APIs
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                  MongoDB Database
```

---

# 🔐 Authentication Flow

```text
Business Login
      │
      ▼
JWT Generated
      │
      ▼
Stored in Browser
      │
      ▼
Attached with Every Request
      │
      ▼
Backend Middleware
      │
      ▼
Access Granted
```

---

# 📦 Inventory Workflow

```text
Add Product
      │
      ▼
Validate Data
      │
      ▼
Save to MongoDB
      │
      ▼
Calculate Status
      │
      ▼
Generate Alerts
      │
      ▼
Display on Dashboard
```

---

# 📄 CSV Upload Workflow

```text
Upload CSV
      │
      ▼
Multer Upload
      │
      ▼
CSV Parser
      │
      ▼
Validate Data
      │
      ▼
Store Inventory
      │
      ▼
Generate Alerts
```

---

# 📷 Barcode Scanner Workflow

```text
Open Scanner
      │
      ▼
Scan Barcode
      │
      ▼
Read Product Code
      │
      ▼
Auto-fill Inventory Form
      │
      ▼
Save Product
```

---

# 🚨 Expiry Monitoring Workflow

```text
Inventory Added
        │
        ▼
Calculate Days Remaining
        │
        ▼
Status Generated
        │
        ▼
Expiry Alert Created
        │
        ▼
Dashboard Updated
```

---

# 📌 REST API Endpoints

## Authentication

```http
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

---

## Inventory

```http
GET /api/inventory

POST /api/inventory

PUT /api/inventory/:id

DELETE /api/inventory/:id
```

---

## Categories

```http
GET /api/categories

POST /api/categories
```

---

## Alerts

```http
GET /api/alerts

PATCH /api/alerts/:id/read
```

---

## CSV Upload

```http
POST /api/inventory/upload
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/sumit-git204/Food-Redistribution-System-for-Waste-Reduction.git

cd Food-Redistribution-System-for-Waste-Reduction
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

Runs on:

```
http://localhost:5000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs on

```
http://localhost:3000
```

---

# 🌍 Environment Variables

Backend `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

# 📊 Dashboard Metrics

The Business Dashboard displays:

- Total Products
- Products Near Expiry
- Expired Products
- Low Stock Products
- Total Categories
- Recent Inventory
- Recent Alerts

---

# 🔒 Validation Rules

- Unique Email Registration
- JWT Protected APIs
- Password Hashing
- Expiry Date ≥ Manufacture Date
- Current Stock ≥ 0
- Minimum Stock ≥ 0
- Required Fields Validation
- CSV Column Validation

---

# 🎯 Milestone 1 Deliverables

✔ Business Authentication

✔ Inventory CRUD

✔ Category Management

✔ Barcode & QR Scanner

✔ CSV Bulk Upload

✔ Expiry Alert System

✔ Dashboard

✔ Input Validation

✔ Responsive User Interface

---

# 🚀 Future Scope (Upcoming Milestones)

## Milestone 2

- AI Waste Prediction Engine
- Prophet Forecasting
- LSTM Forecasting
- FastAPI Microservice
- Reorder Recommendations

---

## Milestone 3

- NGO Portal
- Food Donation Marketplace
- Pickup Scheduling
- Live Notifications
- Analytics Dashboard

---

## Milestone 4

- Complete System Integration
- Automated Email Notifications
- Docker Deployment
- CI/CD Pipeline
- Performance Testing
- Production Deployment

---

# 👨‍💻 Developed By

**Sumit Badoni**

GitHub:
https://github.com/sumit-git204

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future development.
