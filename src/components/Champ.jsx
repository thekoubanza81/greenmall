export default function Champ({ label, name, type = 'text', valeur, erreur, touche, onChange, onBlur }) {
  let classe = ''
  if (touche) classe = erreur ? 'champ-erreur' : 'champ-ok'

  return (
    <div className="champ">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={valeur}
        onChange={onChange}
        onBlur={onBlur}
        className={classe}
      />
      {touche && erreur && <p className="erreur">{erreur}</p>}
    </div>
  )
}