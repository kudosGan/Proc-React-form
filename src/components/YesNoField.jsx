function YesNoField({ value, onChange, name }) {

  return (

    <div className="yes-no-group">

      <label>

        <input
          type="radio"
          name={name}
          checked={value === 'Yes'}
          onChange={() => onChange('Yes')}
        />

        Yes

      </label>

      <label>

        <input
          type="radio"
          name={name}
          checked={value === 'No'}
          onChange={() => onChange('No')}
        />

        No

      </label>

    </div>

  )
}

export default YesNoField