import './windows.css'

const FIELDS = [
  { label: 'EMAIL', placeholder: 'email@example.com' },
  { label: 'PHONE', placeholder: '010-0000-0000' },
  { label: 'CONTACT', placeholder: 'message placeholder' },
] as const

export default function ContactWindow() {
  return (
    <div className="win-contact">
      <ul className="win-contact__list">
        {FIELDS.map((field) => (
          <li key={field.label} className="win-contact__item">
            <span className="win-contact__label">{field.label}</span>
            <div className="win-contact__value placeholder-block">
              <span className="win-contact__ghost">{field.placeholder}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
