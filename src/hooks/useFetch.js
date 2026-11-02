import { useState, useEffect } from 'react'

export default function useFetch(url) {
  const [data, setData] = useState(null)
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    let annule = false

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur serveur')
        return res.json()
      })
      .then((resultat) => {
        if (annule) return
        setData(resultat)
        setChargement(false)
      })
      .catch((err) => {
        if (annule) return
        setErreur(err.message)
        setChargement(false)
      })

    return () => {
      annule = true
    }
  }, [url])

  return { data, erreur, chargement }
}