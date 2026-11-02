import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useForm from '../hooks/useForm'
import Champ from '../components/Champ'

function valider(v) {
  const e = {}
  if (v.prenom.trim().length < 2) e.prenom = 'Prénom trop court'
  if (v.nom.trim().length < 2) e.nom = 'Nom trop court'
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Email invalide'
  if (v.motDePasse.length < 6) e.motDePasse = '6 caractères minimum'
  if (v.confirmation !== v.motDePasse || !v.confirmation) {
    e.confirmation = 'Les mots de passe ne correspondent pas'
  }
  return e
}

export default function Inscription() {
  const [erreurServeur, setErreurServeur] = useState('')
  const [chargement, setChargement] = useState(false)
  const { inscription } = useAuth()
  const navigate = useNavigate()
  const { valeurs, estValide, champ, toutToucher } = useForm(
    { prenom: '', nom: '', email: '', motDePasse: '', confirmation: '' },
    valider
  )

  const soumettre = async (e) => {
    e.preventDefault()
    toutToucher()
    if (!estValide) return

    setChargement(true)
    setErreurServeur('')
    try {
      const { prenom, nom, email, motDePasse } = valeurs
      await inscription({ prenom, nom, email, motDePasse })
      navigate('/connexion')
    } catch (err) {
      setErreurServeur(err.message)
      setChargement(false)
    }
  }

  return (
    <form className="formulaire" onSubmit={soumettre} noValidate>
      <h1>Créer un compte</h1>

      <Champ label="Prénom" {...champ('prenom')} />
      <Champ label="Nom" {...champ('nom')} />
      <Champ label="Email" type="email" {...champ('email')} />
      <Champ label="Mot de passe" type="password" {...champ('motDePasse')} />
      <Champ label="Confirmer le mot de passe" type="password" {...champ('confirmation')} />

      {erreurServeur && <p className="erreur erreur-serveur">{erreurServeur}</p>}

      <button type="submit" className="btn" disabled={chargement}>
        {chargement ? 'Création...' : "S'inscrire"}
      </button>

      <p className="lien-bas">
        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </form>
  )
}