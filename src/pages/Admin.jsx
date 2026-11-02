import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import Champ from '../components/Champ'

const VIDE = { libelle: '', prix: '', stock: '' }

function valider(v) {
  const e = {}
  if (v.libelle.trim().length < 3) e.libelle = 'Libellé trop court'
  if (!(Number(v.prix) > 0)) e.prix = 'Prix invalide (supérieur à 0)'
  if (!/^\d+$/.test(v.stock)) e.stock = 'Stock invalide (entier positif ou 0)'
  return e
}

async function appel(url, methode, user, corps) {
  const res = await fetch(url, {
    method: methode,
    headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
    body: JSON.stringify(corps),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.erreur)
  return data
}

function LigneStock({ produit, onAjout }) {
  const [quantite, setQuantite] = useState('')
  const [erreur, setErreur] = useState('')

  const valide = /^[1-9]\d*$/.test(quantite)
  let classe = ''
  if (quantite !== '') classe = valide ? 'champ-ok' : 'champ-erreur'

  const ajouter = async () => {
    try {
      await onAjout(produit.id, Number(quantite))
      setQuantite('')
      setErreur('')
    } catch (err) {
      setErreur(err.message)
    }
  }

  return (
    <li className="admin-ligne">
      <div>
        <h3>{produit.libelle}</h3>
        <p className="stock">
          {produit.prix} € - stock : <strong>{produit.stock}</strong>
        </p>
      </div>
      <div className="admin-stock">
        <input
          type="number"
          min="1"
          placeholder="Quantité"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          className={`champ-mini ${classe}`}
        />
        <button type="button" className="btn" disabled={!valide} onClick={ajouter}>
          Ajouter
        </button>
      </div>
      {erreur && <p className="erreur">{erreur}</p>}
    </li>
  )
}

export default function Admin() {
  const { user } = useAuth()
  const [produits, setProduits] = useState([])
  const [erreurServeur, setErreurServeur] = useState('')
  const [message, setMessage] = useState('')
  const { valeurs, estValide, champ, toutToucher, reinitialiser } = useForm(VIDE, valider)

  useEffect(() => {
    fetch('/api/produits')
      .then((res) => res.json())
      .then(setProduits)
      .catch(() => setErreurServeur('Impossible de charger les produits'))
  }, [])

  const ajouterProduit = async (e) => {
    e.preventDefault()
    toutToucher()
    if (!estValide) return

    setErreurServeur('')
    setMessage('')
    try {
      const nouveau = await appel('/api/produits', 'POST', user, valeurs)
      setProduits((prev) => [...prev, nouveau])
      setMessage(`Produit « ${nouveau.libelle} » ajouté`)
      reinitialiser()
    } catch (err) {
      setErreurServeur(err.message)
    }
  }

  const ajouterStock = async (id, quantite) => {
    const maj = await appel(`/api/produits/${id}/stock`, 'PATCH', user, { quantite })
    setProduits((prev) => prev.map((p) => (p.id === id ? maj : p)))
  }

  return (
    <>
      <h1>Espace admin</h1>

      <section className="admin-bloc">
        <h2>Ajouter un produit</h2>
        <form onSubmit={ajouterProduit} noValidate>
          <Champ label="Libellé" {...champ('libelle')} />
          <Champ label="Prix (€)" type="number" {...champ('prix')} />
          <Champ label="Stock initial" type="number" {...champ('stock')} />

          {erreurServeur && <p className="erreur erreur-serveur">{erreurServeur}</p>}
          {message && <p className="succes">{message}</p>}

          <button type="submit" className="btn">Ajouter le produit</button>
        </form>
      </section>

      <section className="admin-bloc">
        <h2>Gérer le stock</h2>
        <ul className="admin-liste">
          {produits.map((p) => (
            <LigneStock key={p.id} produit={p} onAjout={ajouterStock} />
          ))}
        </ul>
      </section>
    </>
  )
}