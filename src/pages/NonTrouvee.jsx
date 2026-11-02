import { Link } from 'react-router-dom'

export default function NonTrouvee() {
  return (
    <div className="panier-vide">
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas.</p>
      <Link to="/" className="btn">Retour au catalogue</Link>
    </div>
  )
}