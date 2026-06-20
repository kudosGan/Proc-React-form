function Header() {
  return (
    <div className="start-header">

      {/* LEFT SIDE */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <img
          src="/maple1.png"
          alt="Government of Canada"
          style={{ height: 28, width: 'auto' }}
        />
        <div className="start-dept">
          Agriculture and<br />Agri-Food Canada
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <img
          src="/maple1.png"
          alt="Government of Canada"
          style={{ height: 28, width: 'auto' }}
        />
        <div className="start-dept" style={{ textAlign: 'right' }}>
          Agriculture et<br />Agroalimentaire Canada
        </div>
      </div>

    </div>
  )
}

export default Header