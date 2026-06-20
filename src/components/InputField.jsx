function InputField({ label, placeholder = '' }) {
  return (
    <div className="input-group">

      <label className="input-label">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="form-input"
      />

    </div>
  )
}

export default InputField