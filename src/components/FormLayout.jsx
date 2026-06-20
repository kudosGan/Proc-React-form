
import canadalogo1 from '../assests/canada-logo1.png'

function FormLayout({ children }) {
  return (
    <div className="page-container">

      <div className="government-header">

        <div className="gov-left">


          <img src={canadalogo1} alt="Canada Logo" className="logo" />

          <div>
            <div>Agriculture and</div>
            <div>Agri-Food Canada</div>
          </div>

        </div>

        <div className="gov-right">
          <div>Agriculture et</div>
          <div>Agroalimentaire Canada</div>
        </div>

      </div>

      {children}

    </div>
  )
}

export default FormLayout