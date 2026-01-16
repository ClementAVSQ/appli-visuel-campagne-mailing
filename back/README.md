# Backend Outil de Mailing

API REST pour la gestion des campagnes de mailing.

## Routes

### POST /upload
Upload d'un fichier CSV.

**Requête cURL :**
```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@chemin/vers/fichier.csv"
```

**Réponses possibles :**
- 200 : {"message": "Fichier uploadé avec succès !", "filename": "...", "path": "..."}
- 400 : {"message": "Aucun fichier reçu"}
- 500 : {"message": "Erreur serveur"}

### GET /data
Récupère les données traitées d'une campagne.

**Paramètres :** id_campaign (requis)

**Requête cURL :**
```bash
curl "http://localhost:3000/data?id_campaign=123"
```

**Réponses possibles :**
- 200 : {"success": true, "file": {"head": [...], "body": [...]}}
- 400 : {"errors": [...]}
- 404 : {"success": false, "info": "Aucun fichier trouvé pour la campagne ..."}
- 500 : {"success": false, "info": "Erreur serveur lors de la lecture du fichier"}

## Dépendances

- express
- cors
- csv-parser
- express-validator
- multer

## Démarrage

```bash
npm install
node main.js
```

Le serveur écoute sur le port 3000.</content>
<parameter name="filePath">c:\Users\clementa\OneDrive - PROARCHIVES\Bureau\outil de mailing\outil_mailing_back\README.md