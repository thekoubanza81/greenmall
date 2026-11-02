const ETAPES = ['Panier', 'Informations', 'Paiement', 'Confirmation']

export default function Etapes({ actuelle }) {
  return (
    <ol className="etapes">
      {ETAPES.map((nom, i) => {
        let classe = ''
        if (i + 1 === actuelle) classe = 'courante'
        else if (i + 1 < actuelle) classe = 'faite'

        return (
          <li key={nom} className={classe}>
            <span>{i + 1}</span> {nom}
          </li>
        )
      })}
    </ol>
  )
}