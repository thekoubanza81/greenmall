import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const CommandeContext = createContext(null)

export function CommandeProvider({ children }) {
  const [infos, setInfos] = useState(null)
  const [paiement, setPaiement] = useState(null)
  const [commande, setCommande] = useState(null)

  const reinitialiser = useCallback(() => {
    setInfos(null)
    setPaiement(null)
    setCommande(null)
  }, [])

  const value = useMemo(
    () => ({ infos, setInfos, paiement, setPaiement, commande, setCommande, reinitialiser }),
    [infos, paiement, commande, reinitialiser]
  )

  return <CommandeContext.Provider value={value}>{children}</CommandeContext.Provider>
}

export function useCommande() {
  return useContext(CommandeContext)
}