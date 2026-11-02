import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCommande } from '../context/CommandeContext'

export default function Navbar() {
  const [ouvert, setOuvert] = useState(false)
  const { user, deconnexion } = useAuth()
  const { nombreArticles } = useCart()
  const { reinitialiser } = useCommande()
  const navigate = useNavigate()

  const fermer = () => setOuvert(false)

  const quitter = () => {
    deconnexion()
    reinitialiser()
    fermer()
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={fermer}>GreenMall</Link>

      <button
        type="button"
        className={`hamburger ${ouvert ? 'ouvert' : ''}`}
        onClick={() => setOuvert(!ouvert)}
        aria-label="Menu"
        aria-expanded={ouvert}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`menu ${ouvert ? 'ouvert' : ''}`}>
        <NavLink to="/" end onClick={fermer}>Catalogue</NavLink>
        <NavLink to="/panier" onClick={fermer}>
          Panier
          {nombreArticles > 0 && <span className="badge">{nombreArticles}</span>}
        </NavLink>

        {user ? (
          <>
            {user.role === 'admin' && (
              <NavLink to="/admin" onClick={fermer}>Admin</NavLink>
            )}
            <span className="bonjour">Bonjour {user.prenom}</span>
            <button type="button" className="lien" onClick={quitter}>Déconnexion</button>
          </>
        ) : (
          <>
            <NavLink to="/connexion" onClick={fermer}>Connexion</NavLink>
            <NavLink to="/inscription" onClick={fermer}>Inscription</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}