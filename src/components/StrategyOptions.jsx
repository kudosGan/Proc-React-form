function StrategyOptions({ value, onChange }) {

  return (

    <div className="strategy-options">

      <label>
        <input
          type="radio"
          name="strategy"
          checked={value === 'Competitive'}
          onChange={() => onChange('Competitive')}
        />
        Competitive
      </label>

      <label>
        <input
          type="radio"
          name="strategy"
          checked={value === 'Non-Competitive'}
          onChange={() => onChange('Non-Competitive')}
        />
        Non-Competitive
      </label>

      <label>
        <input
          type="radio"
          name="strategy"
          checked={value === 'Standing Offer'}
          onChange={() => onChange('Standing Offer')}
        />
        Under Standing Offer (SO) or Supply Arrangement (SA)
      </label>

    </div>

  )
}

export default StrategyOptions