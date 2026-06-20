function DropdownField({ label, options = [] }) {
  return (
    <div className="input-group">

      <label className="input-label">
        {label}
      </label>

      <select className="form-input">

        <option value="">
          Select Option
        </option>

        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}

      </select>

    </div>
  )
}

export default DropdownField