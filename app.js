import express from "express";
import { mkdir, readdir,rm } from "fs/promises";
import multer from "multer";
import path from "path";

const app = express();

const PORT = 5020;
const PUBLIC_DIR = path.resolve("./public");

// -------------------------------------
// Middleware
// -------------------------------------

app.use(express.json());

// -------------------------------------
// CORS
// -------------------------------------

const allowedOrigins = [
    "http://localhost:5174",
    "http://127.0.0.1:5500",
    "http://localhost:5020"
];

app.use((req, res, next) => {

    const origin = req.headers.origin;

    // Requests without an Origin header
    if (!origin) {
        return next();
    }

    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({
            message: "CORS error"
        });
    }

    res.setHeader(
        "Access-Control-Allow-Origin",
        origin
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    // Browser preflight request
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// -------------------------------------
// Static Files
// -------------------------------------

app.use(express.static(PUBLIC_DIR));

// -------------------------------------
// Home
// -------------------------------------

app.get("/", (req, res) => {
    res.status(200).json({
        message: "<h1>Hello Software Engineers</h1>"
    });
});

// -------------------------------------
// Multer Storage
// -------------------------------------

const storage = multer.diskStorage({

    destination: async (req, file, cb) => {

        try {

            const parentPath = req.body.parentPath || "";

            const uploadPath = path.resolve(
                PUBLIC_DIR,
                parentPath
            );

            // Security check
            if (
                uploadPath !== PUBLIC_DIR &&
                !uploadPath.startsWith(
                    PUBLIC_DIR + path.sep
                )
            ) {
                return cb(
                    new Error("Access denied")
                );
            }

            // Create directory if it doesn't exist
            await mkdir(uploadPath, {
                recursive: true
            });

            cb(null, uploadPath);

        } catch (err) {

            cb(err);

        }
    },

    filename: (req, file, cb) => {

        cb(
            null,
            file.originalname
        );

    }

});

const upload = multer({
    storage
});

// -------------------------------------
// Recursive Directory Tree
// -------------------------------------

async function getDirectoryTree(directory) {

    const entries = await readdir(
        directory,
        {
            withFileTypes: true
        }
    );

    const result = [];

    for (const entry of entries) {

        const fullPath = path.join(
            directory,
            entry.name
        );

        if (entry.isDirectory()) {

            result.push({
                name: entry.name,
                type: "directory",
                children: await getDirectoryTree(
                    fullPath
                )
            });

        } else {

            result.push({
                name: entry.name,
                type: "file"
            });

        }
    }

    return result;
}

// -------------------------------------
// Get All Files
// -------------------------------------

app.get("/files", async (req, res) => {

    try {

        const files = await getDirectoryTree(
            PUBLIC_DIR
        );

        res.status(200).json({
            message: "Files fetched successfully",
            files
        });

    } catch (err) {

        console.error(
            "Failed to fetch files:",
            err
        );

        res.status(500).json({
            message: "Failed to fetch files"
        });

    }

});

// -------------------------------------
// Create Directory
// -------------------------------------

app.post("/directory", async (req, res) => {

    try {

        const {
            parentPath = "",
            dirname
        } = req.body;

        if (!dirname) {

            return res.status(400).json({
                message: "Directory name is required"
            });

        }

        const directoryPath = path.resolve(
            PUBLIC_DIR,
            parentPath,
            dirname
        );

        // Security check
        if (
            directoryPath !== PUBLIC_DIR &&
            !directoryPath.startsWith(
                PUBLIC_DIR + path.sep
            )
        ) {

            return res.status(403).json({
                message: "Access denied"
            });

        }

        await mkdir(directoryPath, {
            recursive: true
        });

        console.log(
            "Directory created:",
            directoryPath
        );

        res.status(201).json({
            message: "Folder created successfully",
            path: path.relative(
                PUBLIC_DIR,
                directoryPath
            )
        });

    } catch (err) {

        console.error(
            "Failed to create directory:",
            err
        );

        res.status(500).json({
            message: "Failed to create directory"
        });

    }

});

// -------------------------------------
// Upload File
// -------------------------------------

app.post(
    "/files",
    (req, res, next) => {

        upload.single("file")(
            req,
            res,
            (err) => {

                if (err) {

                    console.error(
                        "Multer error:",
                        err
                    );

                    return res.status(400).json({
                        message: err.message
                    });

                }

                next();

            }
        );

    },

    (req, res) => {

        console.log(
            "Uploaded file:",
            req.file
        );

        res.status(201).json({
            message: "File uploaded successfully",
            file: req.file?.filename,
            path: req.file?.path
        });

    }
);

// -------------------------------------
// Download File
// -------------------------------------

app.get(
    "/files/download/{*filepath}",
    (req, res) => {

        const relativePath =
            Array.isArray(req.params.filepath)
                ? req.params.filepath.join("/")
                : req.params.filepath;

        const filePath = path.resolve(
            PUBLIC_DIR,
            relativePath
        );

        console.log(
            "Downloading:",
            filePath
        );

        // Security check
        if (
            filePath !== PUBLIC_DIR &&
            !filePath.startsWith(
                PUBLIC_DIR + path.sep
            )
        ) {

            return res.status(403).json({
                message: "Access denied"
            });

        }

        res.download(
            filePath,
            (err) => {

                if (err) {

                    console.error(
                        "Download error:",
                        err
                    );

                    if (!res.headersSent) {

                        res.status(404).json({
                            message: "File not found"
                        });

                    }

                }

            }
        );

    }
);

// -------------------------------------
// Open File
// -------------------------------------

app.get(
    "/files/{*filepath}",
    (req, res) => {

        const relativePath =
            Array.isArray(req.params.filepath)
                ? req.params.filepath.join("/")
                : req.params.filepath;

        const filePath = path.resolve(
            PUBLIC_DIR,
            relativePath
        );

        // Security check
        if (
            filePath !== PUBLIC_DIR &&
            !filePath.startsWith(
                PUBLIC_DIR + path.sep
            )
        ) {

            return res.status(403).json({
                message: "Access denied"
            });

        }

        res.sendFile(
            filePath,
            (err) => {

                if (err) {

                    console.error(
                        "File open error:",
                        err
                    );

                    if (!res.headersSent) {

                        res.status(404).json({
                            message: "File not found"
                        });

                    }

                }

            }
        );

    }
);

// -------------------------------------
// Delete File / Folder
// -------------------------------------
app.delete("/files/{*filepath}", async (req, res) => {
    try {
        const relativePath = Array.isArray(req.params.filepath)
            ? req.params.filepath.join("/")
            : req.params.filepath;

        if (!relativePath) {
            return res.status(400).json({ message: "File or Folder path is required" });
        }

        const filePath = path.resolve(PUBLIC_DIR, relativePath);

        if (filePath === PUBLIC_DIR || !filePath.startsWith(PUBLIC_DIR + path.sep)) {
            return res.status(403).json({ message: "Access denied" });
        }

        console.log("Deleting:", filePath);

        await rm(filePath, {
            recursive: true,
            force: false
        });

        res.status(200).json({ message: "Deleted successfully", path: relativePath });
    } catch (err) {
        console.error("Failed to delete:", err);
        if (err.code === "ENOENT") {
            return res.status(404).json({ message: "File or folder not found" });
        }
        if (err.code === "ENOTEMPTY") {
            return res.status(409).json({ message: "Folder is not empty" });
        }
        res.status(500).json({ message: "Failed to delete file or folder" });
    }
})

// -------------------------------------
// Start Server
// -------------------------------------

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);
