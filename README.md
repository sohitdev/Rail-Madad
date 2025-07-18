# RailMadad

RailMadad is a comprehensive platform designed to streamline the process of filing, tracking, and managing complaints related to railway services. It features an intuitive frontend for users and a robust backend for administrators, ensuring efficient complaint resolution and enhanced user experience.

## Features

- **File a Complaint:** Easy-to-use interface for users to submit complaints with attachments (images/videos).
- **Track Complaint:** Users can track the status of their complaints in real-time.
- **Admin Portal:** Admins can view, manage, and resolve complaints efficiently.
- **Anubhav Section:** Share and view experiences related to railway services.
- **Secure File Uploads:** Supports image and video uploads for better context.

## Folder Structure

```
Railmadad/
├── railmadad-backend/         # Backend server (Node.js/Express)
│   └── server.js              # Main backend server file
│   └── uploads/               # Uploaded images and videos
├── railmadad-frontend/        # Frontend (HTML/CSS/JS)
│   ├── Landing-Page/          # Home page
│   ├── file-a-complaint/      # Complaint filing UI
│   ├── Track-a-complaint/     # Complaint tracking UI
│   ├── admin-login/           # Admin login UI
│   ├── Admin-Portal/          # Admin dashboard
│   ├── anubhav/               # Experience sharing UI
│   └── img/                   # Static images
├── package.json               # Project dependencies
├── package-lock.json          # Dependency lock file
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above recommended)
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

- **File a Complaint:** Go to `file-a-complaint/file.html` and submit your complaint.
- **Track Complaint:** Use `Track-a-complaint/track.html` to check complaint status.
- **Admin Login:** Access `admin-login/login.html` for admin features.
- **Share Experience:** Visit `anubhav/anubhav.html` to share or read experiences.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
