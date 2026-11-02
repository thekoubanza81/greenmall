import { useMemo } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useCommande } from '../../context/CommandeContext'
import useFetch from '../../hooks/useFetch'
import Etapes from '../../components/Etapes'
import { formatPrix } from '../../utils/format'

export default function Validation() {
  const { items, total } = useCart()
  const { setCommande } = useCommande()
  const navigate = useNavigate()
  const { data: produits, erreur, chargement } = useFetch('/api/produits')

  // Articles dont le stock actuel ne couvre plus la quantité du panier
  const problemes = useMemo(() => {
    if (!produits) return []
    return items
      .filter((i) => {
        const p = produits.find((p) => p.id === i.id)
        return !p || p.stock < i.quantite
      })
      .map((i) => i.libelle)
  }, [produits, items])

  if (items.length === 0) return <Navigate to="/panier" replace />

  const continuer = () => {
    setCommande(null)
    navigate('/commande/infos')
  }

  return (
    <>
      <h1>Validation du panier</h1>
      <Etapes actuelle={1} />

      <section className="recap-bloc">
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

      {erreur && <p className="erreur">{erreur}</p>}
      {problemes.length > 0 && (
        <p className="erreur">
          Stock insuffisant ou produit indisponible : {problemes.join(', ')}. Modifiez votre panier.
        </p>
      )}

      <div className="etape-actions">
        <Link to="/panier" className="btn btn-contour">Modifier le panier</Link>
        <button
          type="button"
          className="btn"
          disabled={chargement || problemes.length > 0}
          onClick={continuer}
        >
          Continuer
        </button>
      </div>
    </>
  )
}