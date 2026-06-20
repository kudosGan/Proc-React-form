function Section({ title, children }) {
  return (
    <div className="form-section">

      <div className="section-header">
        {title}
      </div>

      <div className="section-content">
        {children}
      </div>

    </div>
  )
}

export default Section