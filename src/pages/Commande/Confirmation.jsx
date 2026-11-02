import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useCommande } from '../../context/CommandeContext'
import Etapes from '../../components/Etapes'
import { formatPrix, MOYENS_PAIEMENT } from '../../utils/format'

export default function Confirmation() {
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)
  const { user } = useAuth()
  const { items, total, vider } = useCart()
  const { infos, paiement, commande, setCommande, reinitialiser } = useCommande()
  const navigate = useNavigate()

  // Commande enregistrée : écran de succès
  if (commande) {
    const terminer = () => {
      reinitialiser()
      navigate('/')
    }

    return (
      <div className="succes-commande">
        <h1>Merci {user.prenom} !</h1>
        <p>
          Votre commande n°{commande.id} d'un montant de <strong>{formatPrix(commande.total)}</strong> est enregistrée.
        </p>
        <button type="button" className="btn" onClick={terminer}>Retour au catalogue</button>
      </div>
    )
  }

  if (items.length === 0) return <Navigate to="/panier" replace />
  if (!infos) return <Navigate to="/commande/infos" replace />
  if (!paiement) return <Navigate to="/commande/paiement" replace />

  const confirmer = async () => {
    setChargement(true)
    setErreur('')
    try {
      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({
          items: items.map(({ id, quantite }) => ({ id, quantite })),
          infos,
          paiement,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erreur)

      setCommande(data)
      vider()
    } catch (err) {
      setErreur(err.message)
      setChargement(false)
    }
  }

  return (
    <>
      <h1>Confirmation</h1>
      <Etapes actuelle={4} />

      <section className="recap-bloc">
        <h2>Articles</h2>
        <ul className="recap-liste">
          {items.map((i) => (
            <li key={i.id}>
              <span>{i.libelle} × {i.quantite}</span>
              <span>{formatPrix(i.prix * i.quantite)}</span>
            </li>
          ))}
        </ul>
        <p className="recap-total">Total : <strong>{formatPrix(total)}</strong></p>
      </section>

      <section className="recap-bloc">
        <h2>Livraison</h2>
        <p>{infos.prenom} {infos.nom}</p>
        <p>{infos.adresse}</p>
        <p>{infos.codePostal} {infos.ville}</p>
        <p>{infos.email}</p>
        <Link to="/commande/infos" className="lien-modifier">Modifier</Link>
      </section>

      <section className="recap-bloc">
        <h2>Paiement</h2>
        <p>
          {MOYENS_PAIEMENT[paiement.moyen]}
          {paiement.quatreChiffres && ` (carte se terminant par ${paiement.quatreChiffres})`}
        </p>
        <Link to="/commande/paiement" className="lien-modifier">Modifier</Link>
      </section>

      {erreur && <p className="erreur">{erreur}</p>}

      <div className="etape-actions">
        <button type="button" className="btn btn-contour" onClick={() => navigate('/commande/paiement')}>
          Retour
        </button>
        <button type="button" className="btn" disabled={chargement} onClick={confirmer}>
          {chargement ? 'Validation...' : 'Confirmer la commande'}
        </button>
      </div>
    </>
  )
}