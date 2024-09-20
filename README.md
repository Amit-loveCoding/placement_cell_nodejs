# Placement Details Web Application

A web application to manage students and their placements. This app allows administrators to keep track of students, their placement details, and other related information.

## Features

- Manage student data and placement records.
- User authentication using Passport.js.
- Session management with MongoDB.
- Flash messages for notifications.
- CSV export functionality.

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: EJS (Embedded JavaScript)
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Sass (Node-sass-middleware)
- **Authentication**: Passport.js (Local strategy)

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (Running on local or Atlas)
- **Git**

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/placement_details.git
    cd placement_details
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root directory with the following details:

    ```bash
    DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
    SESSION_SECRET=your-session-secret
    ```

4. **Start the application**:

    - For development (using Nodemon):
      ```bash
      npm run start
      ```
    
    - To run without Nodemon:
      ```bash
      node index.js
      ```

5. **Access the app**:

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```bash
.
├── config
│   └── mongoose.js       # MongoDB connection setup
├── controllers           # Handles business logic
├── models                # Mongoose schemas/models
├── routes                # Application routes
├── views                 # EJS templates for rendering
├── assets
│   ├── css               # Stylesheets (compiled from Sass)
│   ├── js                # Frontend JavaScript
│   └── scss              # Sass source files
├── .env                  # Environment variables
├── .gitignore            # Files to ignore in Git
├── index.js              # Entry point of the app
└── package.json          # Project dependencies and scripts
