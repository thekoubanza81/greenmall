import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useCommande } from '../../context/CommandeContext'
import useForm from '../../hooks/useForm'
import Champ from '../../components/Champ'
import Etapes from '../../components/Etapes'

function valider(v) {
  const e = {}
  if (v.prenom.trim().length < 3) e.prenom = 'Prénom trop court'
  if (v.nom.trim().length < 3) e.nom = 'Nom trop court'
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Email invalide'
  if (v.adresse.trim().length < 5) e.adresse = 'Adresse trop courte'
  if (v.ville.trim().length < 4) e.ville = 'Ville invalide'
  if (!/^\d{5}$/.test(v.codePostal)) e.codePostal = 'Code postal invalide (5 chiffres)'
  return e
}

export default function Infos() {
  const { user } = useAuth()
  const { items } = useCart()
  const { infos, setInfos } = useCommande()
  const navigate = useNavigate()

  const { valeurs, estValide, champ, toutToucher } = useForm(
    infos || {
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      adresse: '',
      ville: '',
      codePostal: '',
    },
    valider
  )

  if (items.length === 0) return <Navigate to="/panier" replace />

  const soumettre = (e) => {
    e.preventDefault()
    toutToucher()
    if (!estValide) return
    setInfos(valeurs)
    navigate('/commande/paiement')
  }

  return (
    <>
      <h1>Vos informations</h1>
      <Etapes actuelle={2} />

      <form className="formulaire" onSubmit={soumettre} noValidate>
        <Champ label="Prénom" {...champ('prenom')} />
        <Champ label="Nom" {...champ('nom')} />
        <Champ label="Email" type="email" {...champ('email')} />
        <Champ label="Adresse" {...champ('adresse')} />
        <Champ label="Ville" {...champ('ville')} />
        <Champ label="Code postal" {...champ('codePostal')} />

        <div className="etape-actions">
          <button type="button" className="btn btn-contour" onClick={() => navigate('/commande/validation')}>
            Retour
          </button>
          <button type="submit" className="btn">Continuer</button>
        </div>
      </form>
    </>
  )
}