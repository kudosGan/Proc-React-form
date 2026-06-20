import React from 'react'
import FormLayout from '../components/FormLayout'
import Section from '../components/Section'
import YesNoField from '../components/YesNoField'
import TextAreaField from '../components/TextAreaField'

function Page2({ formData, setFormData }) {

  return (

    <FormLayout>

      <div className="form-title">
        PROCUREMENT REQUEST FORM FOR GOODS, SERVICES AND CONSTRUCTION
      </div>

      {/* ================= PART 3 ================= */}

      <Section title="PART 3 – PROCUREMENT CONSIDERATIONS">

        <div className="section-body">

          {/* ========================================= */}
          {/* ACCESSIBILITY */}
          {/* ========================================= */}
    
          <Section title="Accessibility">
          

          <div
            className="section-content"
            style={{ padding: '10px' }}
          >

            <p>
              The <a href="#">Accessible Canada Act</a> requires organizations
              under federal jurisdiction to identify, remove and prevent barriers
              to accessibility, including in procurement.
            </p>

            <p>
              For this procurement request,
              accessibility criteria is:
            </p>

            <div
              className="radio-group"
              style={{ marginBottom: '10px' }}
            >

              <label>

                <input
                  type="radio"
                  name="accessibility"
                  value="Included"
                  checked={
                    formData.accessibilityType === 'Included'
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accessibilityType: e.target.value
                    })
                  }
                />

                Included as part of the technical specifications.

              </label>

              <br />

              <label>

                <input
                  type="radio"
                  name="accessibility"
                  value="Not Applicable"
                  checked={
                    formData.accessibilityType === 'Not Applicable'
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accessibilityType: e.target.value
                    })
                  }
                />

                Not Applicable

              </label>

              <br />

              <label>

                <input
                  type="radio"
                  name="accessibility"
                  value="Not Available"
                  checked={
                    formData.accessibilityType === 'Not Available'
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accessibilityType: e.target.value
                    })
                  }
                />

                Not Available

              </label>

              <br />

              <label>

                <input
                  type="radio"
                  name="accessibility"
                  value="Other"
                  checked={
                    formData.accessibilityType === 'Other'
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accessibilityType: e.target.value
                    })
                  }
                />

                Other

              </label>

            </div>

            <div className="input-label-spacing">
              If other, please elaborate below:
            </div>

            <TextAreaField
              large
              value={formData.accessibilityDetails}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accessibilityDetails: e.target.value
                })
              }
            />

          </div>
          </Section>

          {/* ========================================= */}
          {/* INDIGENOUS */}
          {/* ========================================= */}
            <Section title="Indigenous">
          

          <div
            className="section-content"
            style={{ padding: '10px' }}
          >

            <p>
              The Government of Canada is committed
              to economic reconciliation with Indigenous peoples.
            </p>

            <div
              className="flex-row-between"
              style={{ marginBottom: '10px' }}
            >

              <span>
                For this procurement request,
                have Indigenous suppliers been considered?
              </span>

              <YesNoField
                value={formData.indigenousConsidered}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    indigenousConsidered: value
                  })
                }
              />

            </div>

            <div className="input-label-spacing">
              If yes, provide details below:
            </div>

            <TextAreaField
              large
              value={formData.indigenousDetails}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  indigenousDetails: e.target.value
                })
              }
            />

          </div>
          </Section>

          {/* ========================================= */}
          {/* ENVIRONMENTAL */}
          {/* ========================================= */}

          <Section title="Environmental">
            
          <div
            className="section-content"
            style={{ padding: '10px' }}
          >

            <p>
              The <a href="#">Policy on Green Procurement</a>
              mandates environmental considerations.
            </p>

            <div
              className="flex-row-between"
              style={{ marginBottom: '10px' }}
            >

              <span>
                Have environmental considerations
                been taken into account?
              </span>

              <YesNoField
                value={formData.environmentalConsidered}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    environmentalConsidered: value
                  })
                }
              />

            </div>

            <div className="input-label-spacing">
              If yes, provide details below:
            </div>

            <TextAreaField
              large
              value={formData.environmentalDetails}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  environmentalDetails: e.target.value
                })
              }
            />

          </div>
          </Section>

          {/* ========================================= */}
          {/* EMPLOYEE EMPLOYER */}
          {/* ========================================= */}

          <Section title="Employee-employer Relationship">

          <div
            className="section-content"
            style={{ padding: '10px' }}
          >

            <p>
              The following questions must be answered
              to ensure no employee-employer relationship exists.
            </p>

            <table
              className="sub-question-table"
              style={{
                width: '100%',
                marginBottom: '10px'
              }}
            >

              <tbody>

                <tr>

                  <td>
                    a) Will the department exercise supervisory control?
                  </td>

                  <td style={{ width: '100px' }}>

                    <YesNoField
                      value={formData.supervisoryControl}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          supervisoryControl: value
                        })
                      }
                    />

                  </td>

                </tr>

                <tr>

                  <td>
                    b) Will the department provide tools?
                  </td>

                  <td>

                    <YesNoField
                      value={formData.provideTools}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          provideTools: value
                        })
                      }
                    />

                  </td>

                </tr>

                <tr>

                  <td>
                    c) Will the contractor have same working hours?
                  </td>

                  <td>

                    <YesNoField
                      value={formData.workingHours}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          workingHours: value
                        })
                      }
                    />

                  </td>

                </tr>

              </tbody>

            </table>

            <div className="input-label-spacing">
              If yes, provide mandatory justification below:
            </div>

            <TextAreaField
              large
              value={formData.employeeEmployerJustification}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  employeeEmployerJustification: e.target.value
                })
              }
            />

          </div>
          </Section>

        </div>

      </Section>

    </FormLayout>

  )

}

export default Page2