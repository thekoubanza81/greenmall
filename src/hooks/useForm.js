import { useState, useMemo, useCallback } from 'react'

export default function useForm(valeursInitiales, valider) {
  const [valeurs, setValeurs] = useState(valeursInitiales)
  const [touches, setTouches] = useState({})

  const erreurs = useMemo(() => valider(valeurs), [valeurs, valider])
  const estValide = Object.keys(erreurs).length === 0

  const onChange = useCallback((e) => {
    const { name, value } = e.target
    setValeurs((prev) => ({ ...prev, [name]: value }))
  }, [])

  const onBlur = useCallback((e) => {
    const { name } = e.target
    setTouches((prev) => ({ ...prev, [name]: true }))
  }, [])

  // À appeler à la soumission pour afficher toutes les erreurs
  const toutToucher = useCallback(() => {
    const tous = {}
    for (const nom of Object.keys(valeurs)) tous[nom] = true
    setTouches(tous)
  }, [valeurs])

  // Raccourci : toutes les props d'un champ
  const champ = (name) => ({
    name,
    valeur: valeurs[name],
    erreur: erreurs[name],
    touche: touches[name],
    onChange,
    onBlur,
  })

    const reinitialiser = useCallback(() => {
    setValeurs(valeursInitiales)
    setTouches({})
  }, [valeursInitiales])

  return { valeurs, erreurs, estValide, champ, toutToucher, reinitialiser }
}