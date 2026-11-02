export function formatPrix(prix) {
  return prix.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export const MOYENS_PAIEMENT = {
  carte: 'Carte bancaire',
  paypal: 'PayPal',
  livraison: 'Paiement à la livraison',
}