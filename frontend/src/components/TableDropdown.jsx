function TableDropdown({
  label,
  options,
  value,
  onChange
}) {

  return (

    <div className="table-field">

      <label>{label}</label>

      <select
        value={value}
        onChange={onChange}
        className="table-input"
      >

        <option value="">
          Select
        </option>

        {options.map((option, index) => (

          <option
            key={index}
            value={option}
          >
            {option}
          </option>

        ))}

      </select>

    </div>

  )
}

export default TableDropdown