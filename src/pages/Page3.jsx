import React from 'react'
import FormLayout from '../components/FormLayout'
import Section from '../components/Section'
import TableField from '../components/TableField'
import YesNoField from '../components/YesNoField'

const CANADIAN_PROVINCES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon'
]

function Page3({ formData, setFormData }) {

  // =========================
  // ADD COST ROW
  // =========================

  const addCostRow = () => {

    setFormData({
      ...formData,
      estimatedCostRows: [
        ...formData.estimatedCostRows,
        {
          fiscalYear: '',
          description: '',
          quantity: '',
          unitCost: '',
          amount: ''
        }
      ]
    })

  }

  // =========================
  // REMOVE COST ROW
  // =========================

  const removeCostRow = (indexToRemove) => {

    if (formData.estimatedCostRows.length === 1) {
      return
    }

    const updatedRows = formData.estimatedCostRows.filter(
      (_, index) => index !== indexToRemove
    )

    setFormData({
      ...formData,
      estimatedCostRows: updatedRows
    })

  }

  // =========================
  // UPDATE COST ROW
  // =========================

  const updateCostRow = (index, field, value) => {

    const updatedRows = [...formData.estimatedCostRows]

    updatedRows[index][field] = value

    setFormData({
      ...formData,
      estimatedCostRows: updatedRows
    })

  }

  // =========================
  // CALCULATE TOTAL
  // =========================

  const totalEstimatedCost = formData.estimatedCostRows.reduce(
    (total, row) => {
      return total + (parseFloat(row.amount) || 0)
    },
    0
  )

  return (

    <FormLayout>

      <div className="form-title">
        PROCUREMENT REQUEST FORM FOR GOODS, SERVICES AND CONSTRUCTION
      </div>

      {/* ================= INTELLECTUAL PROPERTY ================= */}

      <Section title="Intellectual Property">

        <div className="section-body" style={{ padding: '10px' }}>

          <p>
            AAFC has an obligation to comply with the Policy on Title to Intellectual Property Arising Under Crown Procurement Contracts,
            as well as its own Policy on intellectual property for science and technology.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >

            <span style={{ flex: 1 }}>
              For this procurement request, is there a potential for the creation of intellectual property?
            </span>

            <div
              style={{
                minWidth: '120px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >

              <YesNoField
                name="ip_potential"
                value={formData.ipPotential}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    ipPotential: value
                  })
                }
              />

            </div>

          </div>

          <div style={{ marginTop: '15px' }}>
            If yes, who will own the intellectual property created by the Contractor under this contract?
          </div>

          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '5px',
              marginBottom: '10px'
            }}
          >

            <label>

              <input
                type="radio"
                name="ip_owner"
                value="Contractor"
                checked={formData.ipOwner === 'Contractor'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ipOwner: e.target.value
                  })
                }
              />

              Contractor

            </label>

            <label>

              <input
                type="radio"
                name="ip_owner"
                value="Crown"
                checked={formData.ipOwner === 'Crown'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ipOwner: e.target.value
                  })
                }
              />

              Crown

            </label>

            <label>

              <input
                type="radio"
                name="ip_owner"
                value="IP not applicable"
                checked={formData.ipOwner === 'IP not applicable'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ipOwner: e.target.value
                  })
                }
              />

              IP not applicable

            </label>

          </div>

          <p style={{ fontSize: '11px', marginTop: '10px' }}>
            For any questions, please contact AAFC’s Office of Intellectual Property and Commercialization (OIPC).
          </p>

        </div>

      </Section>

      {/* ================= SECURITY REQUIREMENT ================= */}

      <Section title="Security Requirement">

        <div className="section-body" style={{ padding: '10px' }}>

          <p>
            AAFC has an obligation to comply with the Policy on Government Security.
            Requirements must identify whether security provisions are associated with the contract.
          </p>

          <p>
            All services or construction requests must have a completed SRCL.
            For goods, it depends on the requirement.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >

            <span>
              Is there a security requirement?
            </span>

            <div
              style={{
                minWidth: '120px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >

              <YesNoField
                name="security_requirement"
                value={formData.securityRequirement}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    securityRequirement: value
                  })
                }
              />

            </div>

          </div>

        </div>

      </Section>

      {/* ================= OFFICIAL LANGUAGES ================= */}

      <Section title="Official Languages">

        <div className="section-body" style={{ padding: '10px' }}>

          <p>
            AAFC must comply with the Official Languages Act and remains responsible for third-party service delivery compliance.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >

            <span>
              Have official languages requirements been met as per the Guide to Official Languages in Federal Procurement?
            </span>

            <div
              style={{
                minWidth: '120px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >

              <YesNoField
                name="official_languages"
                value={formData.officialLanguages}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    officialLanguages: value
                  })
                }
              />

            </div>

          </div>

        </div>

      </Section>

      {/* ================= LIFE CYCLE COST ================= */}

      <Section title="Life Cycle Cost(s)">

        <div className="section-body" style={{ padding: '10px' }}>

          <p>
            Life cycle cost considerations are required for all capital assets valued at $50,000 or above.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >

            <span>
              Is this a capital asset valued at $50,000 or above?
            </span>

            <div
              style={{
                minWidth: '120px',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >

              <YesNoField
                name="life_cycle_cost"
                value={formData.lifeCycleCost}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    lifeCycleCost: value
                  })
                }
              />

            </div>

          </div>

        </div>

      </Section>

      {/* ================= PART 4 ESTIMATED COST ================= */}

      <Section title="PART 4 – ESTIMATED COST">

        <div className="section-body" style={{ padding: '10px' }}>

          <p>
            All costs must be identified in Canadian (CAD) funds.
          </p>

          <table className="procurement-cost-table">

            <thead>

              <tr>

                <th style={{ width: '5%' }}></th>

                <th style={{ width: '10%' }}>
                  Fiscal Year
                </th>

                <th style={{ width: '45%' }}>
                  Description
                </th>

                <th style={{ width: '10%' }}>
                  Quantity
                </th>

                <th style={{ width: '15%' }}>
                  Unit Cost
                </th>

                <th style={{ width: '15%' }}>
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {formData.estimatedCostRows.map((row, index) => (

                <tr key={index}>

                  <td>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >

                      <button
                        type="button"
                        onClick={addCostRow}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeCostRow(index)}
                      >
                        -
                      </button>

                    </div>

                  </td>

                  <td>

                    <TableField
                      value={row.fiscalYear}
                      onChange={(e) =>
                        updateCostRow(
                          index,
                          'fiscalYear',
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <TableField
                      value={row.description}
                      onChange={(e) =>
                        updateCostRow(
                          index,
                          'description',
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <TableField
                      value={row.quantity}
                      onChange={(e) =>
                        updateCostRow(
                          index,
                          'quantity',
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <TableField
                      value={row.unitCost}
                      onChange={(e) =>
                        updateCostRow(
                          index,
                          'unitCost',
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <TableField
                      value={row.amount}
                      onChange={(e) =>
                        updateCostRow(
                          index,
                          'amount',
                          e.target.value
                        )
                      }
                    />

                  </td>

                </tr>

              ))}

              <tr>

                <td colSpan="5">
                  Estimated Cost (excluding taxes)
                </td>

                <td>
                  ${totalEstimatedCost.toFixed(2)}
                </td>

              </tr>

              <tr>

                <td colSpan="2">
                  Estimated Taxes
                </td>

                <td colSpan="3">

                  <select
                    className="table-input"
                    value={formData.taxProvince}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        taxProvince: e.target.value
                      })
                    }
                  >

                    <option value="">
                      Select Province
                    </option>

                    {CANADIAN_PROVINCES.map((province) => (

                      <option
                        key={province}
                        value={province}
                      >
                        {province}
                      </option>

                    ))}

                  </select>

                </td>

                <td></td>

              </tr>

              <tr>

                <td colSpan="5">
                  Travel and Living Expenses
                </td>

                <td>

                  <TableField
                    value={formData.travelExpenses}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        travelExpenses: e.target.value
                      })
                    }
                  />

                </td>

              </tr>

              <tr>

                <td colSpan="5">

                  <strong>
                    TOTAL ESTIMATED COST
                  </strong>

                </td>

                <td>

                  <strong>

                    $
                    {(
                      totalEstimatedCost +
                      (parseFloat(formData.travelExpenses) || 0)
                    ).toFixed(2)}

                  </strong>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </Section>

    </FormLayout>

  )
}

export default Page3