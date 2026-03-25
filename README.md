# RailMadad

RailMadad is a comprehensive platform designed to streamline the process of filing, tracking, and managing complaints related to railway services. It features an intuitive frontend for users and a robust backend for administrators, ensuring efficient complaint resolution and enhanced user experience.

## Features

- **File a Complaint:** Easy-to-use interface for users to submit complaints with attachments (images/videos).
- **Track Complaint:** Users can track the status of their complaints in real-time.
- **Admin Portal:** Admins can view, manage, and resolve complaints efficiently.
- **Feedback Section:** Share and view experiences related to railway services.
- **Secure File Uploads:** Supports image and video uploads for better context.

## Folder Structure

```
Railmadad/
├── railmadad-backend/         # Backend server (Node.js/Express)
│   └── server.js              # Main backend server file
│   └── uploads/               # Uploaded images and videos
├── railmadad-frontend/        # Frontend (HTML/CSS/JS)
│   ├── home/          # Home page
│   ├── file-a-complaint/      # Complaint filing UI
│   ├── Track-a-complaint/     # Complaint tracking UI
│   ├── admin-login/           # Admin login UI
│   ├── Admin-Portal/          # Admin dashboard
│   ├── feedback/              # Experience sharing UI
│   └── img/                   # Static images
├── package.json               # Project dependencies
├── package-lock.json          # Dependency lock file
├── .env.example               # Sample environment variables
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or above recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/learner-sohit/Rail-Madad.git
   cd Railmadad
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   ```sh
   cp .env.example .env
   ```
   Update `.env` with your local database credentials and API key.

## Environment Variables

This project reads configuration from `.env` (loaded automatically by the backend).

- `PORT` - Backend port (default: `3000`)
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `GEMINI_API_KEY` - Gemini API key for AI complaint classification (optional)

### Running the Project

#### Backend

Start the backend server:

```sh
node railmadad-backend/server.js
```

Or, for auto-reload on changes (requires nodemon):

```sh
npm install -g nodemon
nodemon railmadad-backend/server.js
```

#### Frontend

Open any HTML file in `railmadad-frontend/` directly in your browser, or serve the folder using a static server:

```sh
npx live-server railmadad-frontend/
```

Or

```sh
npx http-server railmadad-frontend/
```

## Usage

- **File a Complaint:** Go to `file-a-complaint/` and submit your complaint.
- **Track Complaint:** Use `Track-a-complaint/` to check complaint status.
- **Admin Login:** Access `admin-login/` for admin features.
- **Share Experience:** Visit `feedback/` to share or read experiences.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
