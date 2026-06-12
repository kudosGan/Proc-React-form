function FormFooter({
  currentPage,
  totalPages,
  onNext,
  onBack,
  onSubmit,
  submitDisabled,
  submitLabel
}) {

  return (

    <div className="form-footer">

      <div className="footer-left">
        AAFC/AAC A9565
      </div>

      <div className="footer-center">

        {currentPage > 1 && (
          <button onClick={onBack}>
            Back
          </button>
        )}

        {currentPage < totalPages && (
          <button onClick={onNext}>
            Next
          </button>
        )}

        {currentPage === totalPages && (
          <button
            onClick={onSubmit}
            disabled={submitDisabled}
            style={{
              opacity: submitDisabled ? 0.5 : 1,
              cursor : submitDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {submitLabel || 'Submit'}
          </button>
        )}

      </div>

      <div className="footer-right">
        <img
          src="/canada-wordmark.png"
          alt="Canada"
          className="footer-canada-logo"
        />
      </div>

    </div>

  )
}

export default FormFooter