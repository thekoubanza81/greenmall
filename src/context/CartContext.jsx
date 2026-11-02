import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('panier')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(items))
  }, [items])

  const ajouter = useCallback((produit) => {
    if (produit.stock < 1) return
    setItems((prev) => {
      const existant = prev.find((i) => i.id === produit.id)
      if (existant) {
        if (existant.quantite >= produit.stock) return prev
        return prev.map((i) =>
          i.id === produit.id ? { ...i, quantite: i.quantite + 1 } : i
        )
      }
      const { id, libelle, prix, stock } = produit
      return [...prev, { id, libelle, prix, stock, quantite: 1 }]
    })
  }, [])

  const changerQuantite = useCallback((id, quantite) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantite: Math.max(1, Math.min(quantite, i.stock)) } : i
      )
    )
  }, [])

  const retirer = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const vider = useCallback(() => setItems([]), [])

  const total = useMemo(
    () => items.reduce((somme, i) => somme + i.prix * i.quantite, 0),
    [items]
  )

  const nombreArticles = useMemo(
    () => items.reduce((somme, i) => somme + i.quantite, 0),
    [items]
  )

  const value = useMemo(
    () => ({ items, ajouter, changerQuantite, retirer, vider, total, nombreArticles }),
    [items, ajouter, changerQuantite, retirer, vider, total, nombreArticles]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}