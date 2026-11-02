import bcrypt from 'bcryptjs'
import db from './db.js'

const admin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin')
if (!admin) {
  db.prepare(
    'INSERT INTO users (prenom, nom, role, email, motDePasse) VALUES (?, ?, ?, ?, ?)'
  ).run('Admin', 'GreenMall', 'admin', 'admin@greenmall.fr', bcrypt.hashSync('admin123', 10))
  console.log('Admin créé : admin@greenmall.fr / admin123')
}

const { total } = db.prepare('SELECT COUNT(*) AS total FROM produits').get()
if (total === 0) {
  const insert = db.prepare('INSERT INTO produits (libelle, prix, stock) VALUES (?, ?, ?)')
  insert.run('Ecran AMOLED 4K UHD', 299.99, 20)
  insert.run('Clavier + souris', 35.99, 35)
  insert.run('Lampe de bureau', 25.99, 10)
  insert.run('Support pour téléphone', 15.99, 50)
  console.log('Produits de test insérés dans la base de données')
}