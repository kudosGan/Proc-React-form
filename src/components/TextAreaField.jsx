function TextAreaField({
  value,
  onChange,
  large = false
}) {

  return (

    <div className="textarea-wrapper">

      <textarea
        value={value}
        onChange={onChange}
        className={`textarea-field ${large ? 'large-textarea' : ''}`}
      />

    </div>

  )

}

export default TextAreaField