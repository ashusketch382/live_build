# Live Dashboard Project - Backend

This repository contains the backend of the **Live Dashboard Project**. The dashboard provides real-time build status updates to various teams, reducing manual status inquiries and improving workflow efficiency.  

---

## 🚀 API Routes  

These are the backend API routes used by the frontend to interact with the database:  

### **📌 Retrieve Data**  
- `GET /allBuild` - Fetch all build entries from the database.  
- `GET /Build` - Fetch a specific build entry from the database.  

### **📌 Modify Data**  
- `PATCH /updateBuild` - Update a specific build entry in the database.  
- `POST /createBuild` - Create a new build entry in the database.  

---

## 🛠️ Setup Instructions  

⚙️ Backend Setup Clone the backend repository:
```sh
   git clone https://github.com/ashusketch382/live_build.git
   cd live_build
   npm install
   node index.js
```

### Create Environment File

Create a .env file in the root directory and add:
```sh
PORT=your_port_number
DATABASE_URL=your_postgresql_connection_string
```

### Install Dependencies
```sh
npm install
```

###  Start the Server
```sh
node index.js
```

📌 Notes
Ensure PostgreSQL is running and accessible.

The backend will run on http://localhost:8080.
