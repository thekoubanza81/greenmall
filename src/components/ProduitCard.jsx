import { useCart } from '../context/CartContext'
import { formatPrix } from '../utils/format'

export default function ProduitCard({ produit, index }) {
  const { items, ajouter } = useCart()

  const dansPanier = items.find((i) => i.id === produit.id)?.quantite || 0
  const rupture = produit.stock < 1
  const stockAtteint = dansPanier >= produit.stock

  let texte = 'Ajouter au panier'
  if (rupture) texte = 'Rupture de stock'
  else if (stockAtteint) texte = 'Stock maximum atteint'

  return (
    <article className="carte" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="carte-visuel">{produit.libelle.charAt(0)}</div>
      <div className="carte-corps">
        <h2>{produit.libelle}</h2>
        <p className="prix">{formatPrix(produit.prix)}</p>
        <p className="stock">{rupture ? 'Indisponible' : `${produit.stock} en stock`}</p>
        <button
          type="button"
          className="btn"
          disabled={rupture || stockAtteint}
          onClick={() => ajouter(produit)}
        >
          {texte}
        </button>
      </div>
    </article>
  )
}