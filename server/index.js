import express from 'express'
import bcrypt from 'bcryptjs'
import db from './db.js'
import './seed.js'

const app = express()
app.use(express.json())

// Catalogue
app.get('/api/produits', (req, res) => {
  const produits = db.prepare('SELECT * FROM produits').all()
  res.json(produits)
})

app.post('/api/inscription', (req, res) => {
  const { prenom, nom, email, motDePasse } = req.body

  if (!prenom || !nom || !email || !motDePasse) {
    return res.status(400).json({ erreur: 'Tous les champs sont obligatoires' })
  }

  const existant = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existant) {
    return res.status(409).json({ erreur: 'Cet email est déjà utilisé' })
  }

  const hash = bcrypt.hashSync(motDePasse, 10)
  const result = db
    .prepare('INSERT INTO users (prenom, nom, role, email, motDePasse) VALUES (?, ?, ?, ?, ?)')
    .run(prenom, nom, 'user', email, hash)

  res.status(201).json({ id: result.lastInsertRowid, prenom, nom, role: 'user', email })
})

// Connexion
app.post('/api/connexion', (req, res) => {
  const { email, motDePasse } = req.body

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(motDePasse || '', user.motDePasse)) {
    return res.status(401).json({ erreur: 'Email ou mot de passe incorrect' })
  }

  const { motDePasse: _, ...userSansMdp } = user
  res.json(userSansMdp)
})

function verifierAdmin(req, res, next) {
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.headers['x-user-id'])
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ erreur: 'Accès réservé à un administrateur' })
  }
  next()
}

// Ajout d'un produit
app.post('/api/produits', verifierAdmin, (req, res) => {
  const libelle = (req.body.libelle || '').trim()
  const prix = Number(req.body.prix)
  const stock = Number(req.body.stock)

  if (libelle.length < 3 || !(prix > 0) || !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ erreur: 'Données du produit invalides' })
  }

  const result = db
    .prepare('INSERT INTO produits (libelle, prix, stock) VALUES (?, ?, ?)')
    .run(libelle, prix, stock)

  res.status(201).json({ id: result.lastInsertRowid, libelle, prix, stock })
})

// Ajout de stock à un produit existant
app.patch('/api/produits/:id/stock', verifierAdmin, (req, res) => {
  const quantite = Number(req.body.quantite)

  if (!Number.isInteger(quantite) || quantite < 1) {
    return res.status(400).json({ erreur: 'Quantité invalide' })
  }

  const result = db
    .prepare('UPDATE produits SET stock = stock + ? WHERE id = ?')
    .run(quantite, req.params.id)

  if (result.changes === 0) {
    return res.status(404).json({ erreur: 'Produit introuvable' })
  }

  res.json(db.prepare('SELECT * FROM produits WHERE id = ?').get(req.params.id))
})

app.listen(3001, () => console.log('API sur http://localhost:3001'))

// Vérifie qu'un utilisateur existe
function verifierUser(req, res, next) {
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.headers['x-user-id'])
  if (!user) {
    return res.status(401).json({ erreur: 'Connexion requise' })
  }
  req.userId = user.id
  next()
}

// Enregistrement d'une commande
app.post('/api/commandes', verifierUser, (req, res) => {
  const { items, infos, paiement } = req.body

  const champsInfos = ['prenom', 'nom', 'email', 'adresse', 'ville', 'codePostal']
  const moyens = ['carte', 'paypal', 'livraison']

  if (
    !Array.isArray(items) || items.length === 0 ||
    !items.every((i) => Number.isInteger(i.quantite) && i.quantite > 0) ||
    !infos || champsInfos.some((c) => !infos[c]) ||
    !paiement || !moyens.includes(paiement.moyen)
  ) {
    return res.status(400).json({ erreur: 'Commande invalide' })
  }

  const quatreChiffres = /^\d{4}$/.test(paiement.quatreChiffres || '') ? paiement.quatreChiffres : null

  // Transaction : tout est enregistré, ou rien du tout
  const creer = db.transaction(() => {
    const commande = db
      .prepare(
        `INSERT INTO commandes
         (userId, prenom, nom, email, adresse, ville, codePostal, moyenPaiement, quatreChiffres, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
      )
      .run(
        req.userId, infos.prenom, infos.nom, infos.email,
        infos.adresse, infos.ville, infos.codePostal,
        paiement.moyen, quatreChiffres
      )

    let total = 0
    for (const item of items) {
      const produit = db.prepare('SELECT * FROM produits WHERE id = ?').get(item.id)
      if (!produit) throw new Error('Produit introuvable')
      if (produit.stock < item.quantite) {
        throw new Error(`Stock insuffisant pour « ${produit.libelle} »`)
      }

      db.prepare(
        'INSERT INTO lignes_commande (commandeId, produitId, quantite, prix) VALUES (?, ?, ?, ?)'
      ).run(commande.lastInsertRowid, produit.id, item.quantite, produit.prix)

      db.prepare('UPDATE produits SET stock = stock - ? WHERE id = ?').run(item.quantite, produit.id)

      total += produit.prix * item.quantite
    }

    total = Math.round(total * 100) / 100
    db.prepare('UPDATE commandes SET total = ? WHERE id = ?').run(total, commande.lastInsertRowid)

    return { id: Number(commande.lastInsertRowid), total }
  })

  try {
    res.status(201).json(creer())
  } catch (err) {
    res.status(409).json({ erreur: err.message })
  }
})