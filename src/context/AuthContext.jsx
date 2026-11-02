import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const AuthContext = createContext(null)

async function envoyer(url, donnees) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donnees),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.erreur)
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const sauvegarde = localStorage.getItem('user')
    return sauvegarde ? JSON.parse(sauvegarde) : null
  })

  const connexion = useCallback(async (email, motDePasse) => {
    const data = await envoyer('/api/connexion', { email, motDePasse })
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const inscription = useCallback(async (infos) => {
    return await envoyer('/api/inscription', infos)
  }, [])

  const deconnexion = useCallback(() => {
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, connexion, inscription, deconnexion }),
    [user, connexion, inscription, deconnexion]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}