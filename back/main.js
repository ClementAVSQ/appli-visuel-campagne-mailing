const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const { query, validationResult } = require("express-validator");
const fs_promise = require("fs").promises;
const fs = require("fs");
const data_setting = require("./setting_data_csv.js"); // Assure-toi que ce fichier est bien dans le dossier backend
const csv = require("csv-parser");
const path = require('path');
const { fileURLToPath } = require('url');

// Définir __dirname pour les modules CommonJS
const __dirname = path.dirname(require.main.filename);
const PORT = 3000;

// 1. CORS : On accepte tout pour que l'interface Electron puisse se connecter
app.use(cors({
    origin: '*' 
}));

// Middleware pour lire le JSON
app.use(express.json());

// --- GESTION DES DOSSIERS ---
const createUploadFolders = () => {
    // On utilise __dirname pour être sûr d'être dans le dossier backend
    const folders = [
        path.join(__dirname, 'fichier_csv'),
        path.join(__dirname, 'fichier_csv', 'data_by_link')
    ];

    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
            console.log(`✅ Dossier créé: ${folder}`);
        } else {
            console.log(`✓ Dossier existe déjà: ${folder}`);
        }
    });
};
createUploadFolders();

// --- CONFIGURATION MULTTER ---
// J'ai corrigé les chemins pour utiliser path.join(__dirname, ...)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Base path
        let folder = path.join(__dirname, 'fichier_csv');
        
        if (req.path === "/link/upload") {
            folder = path.join(folder, 'data_by_link');
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel") {
            cb(null, true);
        } else {
            cb(new Error("Seuls les fichiers CSV sont autorisés"));
        }
    }
});

// --- TES ROUTES (Je n'ai rien changé ici) ---

// Route racine
app.get("/", (req, res) => {
    // ... (ton code original) ...
    // J'ai raccourci ici pour la lisibilité, garde tout ton code original
    const routes = [
        { method: 'GET', path: '/', description: 'Liste des routes disponibles' },
        { method: 'POST', path: '/upload', description: 'Upload d\'un fichier CSV' },
        { method: 'GET', path: '/data', description: 'Récupération des données' },
        { method: 'POST', path: '/link/upload', description: 'Upload lien' }
    ];
    return res.json({ routes });
});

app.post("/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });
        return res.json({ message: "Fichier uploadé avec succès !", filename: req.file.filename });
    } catch (err) {
        return res.status(500).json({ message: "Erreur serveur" });
    }
});

app.get("/data", [
    query("id_campaign").notEmpty().withMessage("Il faut un id de campagne")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        // Utilisation de path.join pour la robustesse
        const csvDir = path.join(__dirname, "fichier_csv");
        const files = await fs_promise.readdir(csvDir);
        const file = files.find(f => f.split(".")[0] === req.query.id_campaign);
        
        if (!file) return res.status(400).json({ success: false, info: `Aucun fichier trouvé pour ${req.query.id_campaign}` });

        const filePath = path.join(csvDir, file);
        const data = await data_setting(filePath);
        return res.status(200).json({ success: true, file: data });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, info: `Erreur serveur` });
    }
});

app.get("/link", [
    query("id_campaign").notEmpty().withMessage("tu dois envoyer un id de campagne")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id_campaign = req.query.id_campaign;
    const filePath = path.join(__dirname, "fichier_csv", "data_by_link", `${id_campaign}.csv`);

    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, error: "file not found" });

    const results = {}; 
    fs.createReadStream(filePath)
        .pipe(csv({ separator: ";" }))
        .on('headers', (headers) => {
            const links = headers.filter(h => h.startsWith("http://") || h.startsWith("https://") || h.startsWith("mailto:"));
            links.forEach(link => results[link] = []);
        })
        .on('data', (row) => {
            Object.keys(results).forEach(link => {
                const value = row[link]?.trim();
                if (value) {
                    const emailKey = Object.keys(row).find(key => key.trim().toLowerCase().includes('mail'));
                    if (emailKey) {
                        const email = row[emailKey]?.trim();
                        if (email && email.includes('@')) results[link].push(email);
                    }
                }
            });
        })
        .on('end', () => {
            const responseData = Object.keys(results).map(link => ({ link, list_mail: results[link] }));
            res.json({ success: true, data: responseData });
        })
        .on('error', (err) => {
            res.status(500).json({ success: false, error: "Erreur lecture CSV" });
        });
});

app.post("/link/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu", success: false });
        return res.json({ success: true, message: "Fichier uploadé avec succès !", filename: req.file.filename });
    } catch (err) {
        return res.status(500).json({ message: "Erreur serveur", success: false });
    }
});

// 2. MODIFICATION ICI : On exporte une fonction pour démarrer le serveur
// au lieu de le démarrer tout de suite.
function startServer() {
    return new Promise((resolve, reject) => {
        const server = app.listen(PORT, () => {
            console.log(`✅ Serveur Backend démarré sur http://localhost:${PORT}`);
            resolve(server);
        }).on('error', (err) => {
            console.error("Erreur démarrage serveur:", err);
            reject(err);
        });
    });
}

module.exports = { app, startServer };