import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrix } from '../utils/format'

export default function Panier() {
  const { items, changerQuantite, retirer, vider, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const commander = () => {
    navigate(user ? '/commande/validation' : '/connexion')
  }

  if (items.length === 0) {
    return (
      <div className="panier-vide">
        <h1>Panier</h1>
        <p>Votre panier est vide.</p>
        <Link to="/" className="btn">Voir le catalogue</Link>
      </div>
    )
  }

  return (
    <>
      <h1>Panier</h1>

      <ul className="panier-liste">
        {items.map((item) => (
          <li key={item.id} className="panier-ligne">
            <div className="panier-info">
              <h2>{item.libelle}</h2>
              <p className="stock">{formatPrix(item.prix)} l'unité</p>
            </div>

            <div className="quantite">
              <button
                type="button"
                className="btn-rond"
                onClick={() => changerQuantite(item.id, item.quantite - 1)}
                disabled={item.quantite <= 1}
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <span>{item.quantite}</span>
              <button
                type="button"
                className="btn-rond"
                onClick={() => changerQuantite(item.id, item.quantite + 1)}
                disabled={item.quantite >= item.stock}
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>

            <p className="prix">{formatPrix(item.prix * item.quantite)}</p>

            <button type="button" className="lien-retirer" onClick={() => retirer(item.id)}>
              Retirer
            </button>
          </li>
        ))}
      </ul>

      <div className="panier-total">
        <p>
          Total : <strong>{formatPrix(total)}</strong>
        </p>
        <div className="panier-actions">
          <button type="button" className="btn btn-contour" onClick={vider}>
            Vider le panier
          </button>
          <button type="button" className="btn" onClick={commander}>
            {user ? 'Passer la commande' : 'Se connecter pour commander'}
          </button>
        </div>
      </div>
    </>
  )
}