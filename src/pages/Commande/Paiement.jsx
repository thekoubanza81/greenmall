import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useCommande } from '../../context/CommandeContext'
import useForm from '../../hooks/useForm'
import Champ from '../../components/Champ'
import Etapes from '../../components/Etapes'
import { MOYENS_PAIEMENT } from '../../utils/format'

function valider(v) {
  const e = {}
  if (v.moyen === 'carte') {
    if (!/^\d{16}$/.test(v.numero.replace(/\s/g, ''))) e.numero = 'Numéro invalide (16 chiffres)'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v.expiration)) e.expiration = 'Format attendu : MM/AA'
    if (!/^\d{3}$/.test(v.cvc)) e.cvc = 'CVC invalide (3 chiffres)'
  }
  return e
}

export default function Paiement() {
  const { items } = useCart()
  const { infos, paiement, setPaiement } = useCommande()
  const navigate = useNavigate()

  const { valeurs, estValide, champ, toutToucher } = useForm(
    { moyen: paiement?.moyen || 'carte', numero: '', expiration: '', cvc: '' },
    valider
  )
  const { onChange } = champ('moyen')

  if (items.length === 0) return <Navigate to="/panier" replace />
  if (!infos) return <Navigate to="/commande/infos" replace />

  const soumettre = (e) => {
    e.preventDefault()
    toutToucher()
    if (!estValide) return

    // On ne garde que les 4 derniers chiffres, jamais le numéro complet
    const quatreChiffres =
      valeurs.moyen === 'carte' ? valeurs.numero.replace(/\s/g, '').slice(-4) : null

    setPaiement({ moyen: valeurs.moyen, quatreChiffres })
    navigate('/commande/confirmation')
  }

  return (
    <>
      <h1>Paiement</h1>
      <Etapes actuelle={3} />

      <form className="formulaire" onSubmit={soumettre} noValidate>
        <div className="choix-groupe">
          {Object.entries(MOYENS_PAIEMENT).map(([cle, libelle]) => (
            <label key={cle} className={`choix ${valeurs.moyen === cle ? 'actif' : ''}`}>
              <input
                type="radio"
                name="moyen"
                value={cle}
                checked={valeurs.moyen === cle}
                onChange={onChange}
              />
              {libelle}
            </label>
          ))}
        </div>

        {valeurs.moyen === 'carte' && (
          <>
            <Champ label="Numéro de carte" {...champ('numero')} />
            <Champ label="Date d'expiration (MM/AA)" {...champ('expiration')} />
            <Champ label="Code de sécurité (CVC)" {...champ('cvc')} />
          </>
        )}

        <div className="etape-actions">
          <button type="button" className="btn btn-contour" onClick={() => navigate('/commande/infos')}>
            Retour
          </button>
          <button type="submit" className="btn">Continuer</button>
        </div>
      </form>
    </>
  )
}