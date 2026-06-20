function TableField({
  label,
  type = 'text',
  value,
  onChange
}) {

  return (

    <div className="table-field">

      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="table-input"
      />

    </div>

  )
}

export default TableField