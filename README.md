# 📁 LocalDrive

A lightweight **local file management system** built with **Node.js, Express, Multer, HTML, CSS, and JavaScript**.

LocalDrive provides a simple web-based interface for managing files and folders stored on the local filesystem. It supports nested directories, file uploads, downloads, opening files, and deleting files or folders.

![LocalDrive](https://github.com/user-attachments/assets/3acb190e-759a-4ac3-850e-6ded9925e213)

---

## ✨ Features

* 📁 Create folders
* 📂 Create nested folders
* 📤 Upload files
* 📥 Upload files directly into nested folders
* 🌳 Recursive file and folder tree
* 👁️ Open files
* ⬇️ Download files
* 🗑️ Delete files
* 🗑️ Delete folders and their contents
* 🔐 Path traversal protection
* 🌐 REST API
* 🔄 Automatically refresh the file tree after operations
* 🎨 Simple and clean web interface

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Fetch API

### Backend

* Node.js
* Express.js
* Multer
* Node.js File System API

### Storage

Local filesystem using the project's `public/` directory.

---

## 📂 Project Structure

```text
LocalDrive/
│
├── public/
│   ├── files/
│   └── folders/
│
├── index.html
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

> The exact structure may vary depending on how you organize your frontend and backend files.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/localdrive.git
```

Move into the project:

```bash
cd localdrive
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Start the server

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5020
```

---

### 4. Start the frontend

Open the frontend using a local development server such as **Live Server**.

For example:

```text
http://127.0.0.1:5500
```

The frontend communicates with the Express backend running on port `5020`.

---

# 🔌 API Endpoints

## Get Files

```http
GET /files
```

Returns the complete recursive file/folder tree.

Example response:

```json
{
  "message": "Files fetched successfully",
  "files": [
    {
      "name": "documents",
      "type": "directory",
      "children": [
        {
          "name": "resume.pdf",
          "type": "file"
        }
      ]
    }
  ]
}
```

---

## Create Folder

```http
POST /directory
```

### Request

```json
{
  "parentPath": "documents",
  "dirname": "projects"
}
```

This creates:

```text
public/
└── documents/
    └── projects/
```

For a root-level folder:

```json
{
  "parentPath": "",
  "dirname": "documents"
}
```

---

## Upload File

```http
POST /files
```

Uses `multipart/form-data`.

Fields:

```text
parentPath
file
```

Example:

```text
parentPath = documents/projects
file = project.pdf
```

The file will be stored at:

```text
public/documents/projects/project.pdf
```

The frontend intentionally sends `parentPath` before the file field so the backend can determine the destination directory during Multer processing.

---

## Open File

```http
GET /files/{filepath}
```

Example:

```text
GET /files/documents/resume.pdf
```

---

## Download File

```http
GET /files/download/{filepath}
```

Example:

```text
GET /files/download/documents/resume.pdf
```

---

## Delete File or Folder

```http
DELETE /files/{filepath}
```

Example:

```text
DELETE /files/documents/resume.pdf
```

or:

```text
DELETE /files/documents/projects
```

Deleting a folder recursively removes its contents.

---

# 🌳 Recursive File System

LocalDrive represents the filesystem as a recursive tree.

For example:

```text
public/
│
├── DSA-Roadmap-FAANG.md
├── GHG-Scope1A.png
│
└── images/
    │
    ├── ZenX AI.pdf
    └── codeRage.png
```

The backend recursively reads directories and returns their children.

The frontend then recursively renders those children into the UI.

This allows LocalDrive to support an arbitrary level of nested folders.

---

# 🔐 Security

LocalDrive includes path validation to prevent access outside the configured `public/` directory.

For example, paths attempting to access:

```text
../../
```

or other directories outside the storage root are rejected.

The backend resolves paths using Node's `path.resolve()` and verifies that the resulting path remains inside the configured storage directory.

This protection is applied to file operations such as opening, downloading, uploading, creating directories, and deleting files/folders.

---

# 🖥️ User Interface

The interface provides:

```text
📁 My Files

[ + New Folder ] [ ↑ Upload File ]

┌───────────────────────────────────────────────┐
│ 📄 DSA-Roadmap-FAANG.md       Open Download Delete
│ 📄 GHG-Scope1A.png            Open Download Delete
│                                               │
│ 📁 images                Upload + Folder Delete
│    │                                          │
│    ├── 📄 ZenX AI.pdf         Open Download Delete
│    │                                          │
│    └── 📄 codeRage.png        Open Download Delete
└───────────────────────────────────────────────┘
```

The current frontend recursively renders folders and maintains the complete relative path of each file/folder.

---

# 📸 Screenshots

### File Manager

![LocalDrive File Manager](https://github.com/user-attachments/assets/3acb190e-759a-4ac3-850e-6ded9925e213)

---

# 📚 What I Learned

This project was built to practice backend and filesystem concepts with Node.js and Express.

Through LocalDrive, I worked with:

* Express routing
* REST API design
* Middleware
* CORS
* Multipart form data
* Multer
* File uploads
* Node.js filesystem APIs
* Recursive directory traversal
* Dynamic filesystem paths
* Path resolution
* Path traversal protection
* File downloads
* File serving
* CRUD-style filesystem operations
* Frontend/backend communication using Fetch API
* Recursive rendering in JavaScript

---

# 🔮 Future Improvements

Possible improvements for future versions:

* 🔍 File search
* ✏️ Rename files and folders
* 📊 File size and metadata
* 📅 Created/modified timestamps
* 📦 Multiple file upload
* 🖱️ Drag-and-drop upload
* 📋 Copy and move files
* 🗜️ ZIP folder download
* 🔐 User authentication
* 👤 Multiple users
* ☁️ Cloud storage support
* 📱 Improved mobile UI
* 🌙 Dark mode
* 🖼️ File previews
* 📈 Storage usage information

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "feat: add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is open-source and available under the **MIT License**.

---

## 👨‍💻 Author

**Harsh Koundal**

Built with ❤️ using Node.js and JavaScript.
