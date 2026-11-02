import Database from 'better-sqlite3'

const db = new Database('greenmall.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    email TEXT NOT NULL UNIQUE,
    motDePasse TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    libelle TEXT NOT NULL,
    prix REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS commandes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    adresse TEXT NOT NULL,
    ville TEXT NOT NULL,
    codePostal TEXT NOT NULL,
    moyenPaiement TEXT NOT NULL,
    quatreChiffres TEXT,
    total REAL NOT NULL,
    date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lignes_commande (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commandeId INTEGER NOT NULL,
    produitId INTEGER NOT NULL,
    quantite INTEGER NOT NULL,
    prix REAL NOT NULL
  );
`)

export default db