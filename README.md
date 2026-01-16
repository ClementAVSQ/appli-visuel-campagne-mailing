# Outil Mailing (Electron + Vue)

Application desktop pour preparer des envois de mailing. L'app permet de charger
des fichiers (CSV/ressources), structurer les donnees, et generer les fichiers
necessaires au workflow interne.

## Ce que fait l'app
- Interface de preparation de campagnes (donnees, fichiers, liens, etc.).
- Upload de fichiers via zone(s) dediees.
- Generation de fichiers via des endpoints exposes par le back pour Electron.

## Ce qu'on retrouve dans l'app
- Frontend Vue (UI et interactions utilisateur).
- Backend Node/Express (endpoints utilises par Electron pour creer des fichiers).
- Electron pour l'application desktop et l'acces systeme de fichiers.

## Comment l'app est faite
- Front dans `front/` (Vue + Vite).
- Back dans `back/` (Express).
- Electron a la racine (`main.cjs`, `preload.cjs`).

Les endpoints du back sont des fonctions utilisees par Electron pour creer des
fichiers et traiter les donnees necessaires au workflow.

## Workflow utilisateur (rapide)
1. L'utilisateur charge les fichiers necessaires via les zones d'upload.
2. Il verifie/complete les donnees de campagne dans l'interface.
3. L'app genere les fichiers requis pour le traitement interne.

## Fonctionnement technique (resume)
1. Le front collecte les fichiers/donnees et declenche les actions.
2. Electron appelle les endpoints du back pour creer/transformer les fichiers.
3. Les fichiers sont sauvegardes localement pour la suite du process.

## Ameliorations prevues / refactorisation
- La zone upload peut etre simplifiee : une seule zone generique, avec un prop
  pour determiner la destination, suffirait. Elle enverrait les fichiers au bon
  endroit en fonction de ce prop.
- Si l'app doit evoluer, ajouter la possibilite d'envoyer des mails, avec un
  visuel de suivi directement dans l'app.

## Lancer le projet
Depuis la racine du projet :

```powershell
# Lancer l'app en mode dev (front + Electron)
npm --prefix front run dev
```

Lint (front) :

```powershell
npm --prefix front run lint
```
