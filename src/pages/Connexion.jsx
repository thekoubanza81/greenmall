import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import Champ from '../components/Champ'

function valider(v) {
  const e = {}
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Email invalide'
  if (!v.motDePasse) e.motDePasse = 'Mot de passe obligatoire'
  return e
}

export default function Connexion() {
  const [erreurServeur, setErreurServeur] = useState('')
  const [chargement, setChargement] = useState(false)
  const { connexion } = useAuth()
  const navigate = useNavigate()
  const { valeurs, estValide, champ, toutToucher } = useForm(
    { email: '', motDePasse: '' },
    valider
  )

  const soumettre = async (e) => {
    e.preventDefault()
    toutToucher()
    if (!estValide) return

    setChargement(true)
    setErreurServeur('')
    try {
      const user = await connexion(valeurs.email, valeurs.motDePasse)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setErreurServeur(err.message)
      setChargement(false)
    }
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      <h1>Connexion</h1>

      <Champ label="Email" type="email" {...champ('email')} />
      <Champ label="Mot de passe" type="password" {...champ('motDePasse')} />

      {erreurServeur && <p className="erreur erreur-serveur">{erreurServeur}</p>}

      <button type="submit" className="btn" disabled={chargement}>
        {chargement ? 'Connexion...' : 'Se connecter'}
      </button>

      <p className="lien-bas">
        Pas de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </form>
  )
}