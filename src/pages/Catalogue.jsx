import useFetch from '../hooks/useFetch'
import ProduitCard from '../components/ProduitCard'

export default function Catalogue() {
  const { data: produits, erreur, chargement } = useFetch('/api/produits')

  if (chargement) return <p>Chargement du catalogue...</p>
  if (erreur) return <p className="erreur">{erreur}</p>

  return (
    <>
      <h1>Catalogue</h1>
      <div className="grille">
        {produits.map((p, i) => (
          <ProduitCard key={p.id} produit={p} index={i} />
        ))}
      </div>
    </>
  )
}