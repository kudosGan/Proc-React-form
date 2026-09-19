function Footer({ lang = 'en' }) {
  const left = lang === 'fr' ? "Système d'approvisionnement d'AAC" : 'AAFC Procurement System'
  return (
    <div className="start-footer">
      <span>{left}</span>
      <span style={{ fontWeight: 500 }}>Canada</span>
    </div>
  )
}

export default Footer