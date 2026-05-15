import FormLayout from '../components/FormLayout'
import Section from '../components/Section'
import TableField from '../components/TableField'
import TableDropdown from '../components/TableDropdown'
import CheckboxField from '../components/CheckboxField'
import YesNoField from '../components/YesNoField'
import TextAreaField from '../components/TextAreaField'
import StrategyOptions from '../components/StrategyOptions'

function Page1({ formData, setFormData }) {

  const branches = [
    'Corporate Management Branch',
    "Deputy Minister's Office",
    'Human Resources Branch',
    'International Affairs Branch',
    'Legal Services',
    'Market and Industry Services Branch',
    "Minister's Office",
    'Office of Audit and Evaluation',
    'Program Branch',
    'Public Affairs Branch',
    'Science and Technology Branch',
    'Strategic Policy Branch'
  ]

  return (

    <FormLayout>

      <div className="form-title">
        PROCUREMENT REQUEST FORM FOR GOODS, SERVICES AND CONSTRUCTION
      </div>

      <div className="form-description">
        A completed signed copy of the form is to be sent to your designated procurement team.
        Should you have any questions or require assistance in the completion of this form,
        please contact your designated procurement team.
      </div>

      {/* ================= PART 1 ================= */}

      <Section title="PART 1 – CLIENT CONTACT INFORMATION">

        <table className="form-table">

          <tbody>

            {/* CLIENT */}

            <tr>
              <td colSpan="2">
                <div className="subsection-title">
                  Client
                </div>
              </td>
            </tr>

            <tr>

              <td>

                <TableField
                  label="First Name:"
                  value={formData.clientFirstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clientFirstName: e.target.value
                    })
                  }
                />

              </td>

              <td>

                <TableField
                  label="Last Name:"
                  value={formData.clientLastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clientLastName: e.target.value
                    })
                  }
                />

              </td>

            </tr>

            <tr>

              <td>

                <TableField
                  label="Email:"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clientEmail: e.target.value
                    })
                  }
                />

              </td>

              <td>

                <TableDropdown
                  label="Branch:"
                  options={branches}
                  value={formData.clientBranch}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clientBranch: e.target.value
                    })
                  }
                />

              </td>

            </tr>

            {/* BUSINESS OWNER */}

            <tr>
              <td colSpan="2">
                <div className="subsection-title">
                  Business Owner
                </div>
              </td>
            </tr>

            <tr>

              <td>

                <TableField
                  label="First Name:"
                  value={formData.businessOwnerFirstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessOwnerFirstName: e.target.value
                    })
                  }
                />

              </td>

              <td>

                <TableField
                  label="Last Name:"
                  value={formData.businessOwnerLastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessOwnerLastName: e.target.value
                    })
                  }
                />

              </td>

            </tr>

            <tr>

              <td>

                <TableField
                  label="Email:"
                  value={formData.businessOwnerEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessOwnerEmail: e.target.value
                    })
                  }
                />

              </td>

              <td>

                <TableDropdown
                  label="Branch:"
                  options={branches}
                  value={formData.businessOwnerBranch}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessOwnerBranch: e.target.value
                    })
                  }
                />

              </td>

            </tr>

          </tbody>

        </table>

      </Section>

      {/* ================= PART 2 ================= */}

      <Section title="PART 2 – REQUIREMENT SUMMARY">

        <table className="form-table">

          <tbody>

            {/* GOODS */}

            <tr>

              <td>

                <CheckboxField
                  label="GOODS"
                  checked={formData.goodsSelected}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goodsSelected: e.target.checked
                    })
                  }
                />

              </td>

              <td>

                <TableField
                  label="Delivery Date (YYYY-MM-DD):"
                  type="date"
                  value={formData.goodsDeliveryDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goodsDeliveryDate: e.target.value
                    })
                  }
                />

              </td>

            </tr>

            {/* SERVICES */}

            <tr>

              <td>

                <CheckboxField
                  label="SERVICE(S)"
                  checked={formData.servicesSelected}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesSelected: e.target.checked
                    })
                  }
                />

              </td>

              <td>

                <div className="grid-2">

                  <TableField
                    label="Start Date (YYYY-MM-DD):"
                    type="date"
                    value={formData.servicesStartDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        servicesStartDate: e.target.value
                      })
                    }
                  />

                  <TableField
                    label="End Date (YYYY-MM-DD):"
                    type="date"
                    value={formData.servicesEndDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        servicesEndDate: e.target.value
                      })
                    }
                  />

                </div>

              </td>

            </tr>

            {/* CONSTRUCTION */}

            <tr>

              <td>

                <CheckboxField
                  label="CONSTRUCTION"
                  checked={formData.constructionSelected}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      constructionSelected: e.target.checked
                    })
                  }
                />

              </td>

              <td>

                <div className="grid-2">

                  <TableField
                    label="Start Date (YYYY-MM-DD):"
                    type="date"
                    value={formData.constructionStartDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        constructionStartDate: e.target.value
                      })
                    }
                  />

                  <TableField
                    label="End Date (YYYY-MM-DD):"
                    type="date"
                    value={formData.constructionEndDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        constructionEndDate: e.target.value
                      })
                    }
                  />

                </div>

              </td>

            </tr>

            {/* DESCRIPTION */}

            <tr>

              <td colSpan="2">

                <div className="table-label">

                  Please provide a brief description of the requirement,
                  outlining the operational need it addresses and any relevant details.

                </div>

                <TextAreaField
                  value={formData.requirementDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requirementDescription: e.target.value
                    })
                  }
                />

              </td>

            </tr>

            {/* PROCUREMENT STRATEGY */}

            <tr>

              <td>

                <div className="table-label">

                  Has the procurement strategy been considered?
                  If yes, please elaborate below:

                </div>

              </td>

              <td>

                <YesNoField
                  value={formData.procurementStrategy}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      procurementStrategy: value
                    })
                  }
                />

              </td>

            </tr>

            {/* STRATEGY OPTIONS */}

            <tr>

              <td colSpan="2">

                <StrategyOptions
                  value={formData.strategyOptions}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      strategyOptions: value
                    })
                  }
                />

              </td>

            </tr>

            {/* CONTINUATION */}

            <tr>

              <td>

                <div className="table-label">
                  Is this a continuation of an existing requirement/project?
                </div>

              </td>

              <td>

                <YesNoField
                  value={formData.continuationRequired}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      continuationRequired: value
                    })
                  }
                />

              </td>

            </tr>

            {/* CONTINUATION DETAILS */}

            <tr>

              <td colSpan="2">

                <div className="table-description">
                  If yes, please elaborate below:
                </div>

                <div className="full-width-textarea">

                  <TextAreaField
                    large
                    value={formData.continuationDetails}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        continuationDetails: e.target.value
                      })
                    }
                  />

                </div>

              </td>

            </tr>

            {/* SUBSEQUENT NEED */}

            <tr>

              <td>

                <div className="table-label">
                  May there be a subsequent need?
                </div>

              </td>

              <td>

                <YesNoField
                  value={formData.subsequentNeed}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      subsequentNeed: value
                    })
                  }
                />

              </td>

            </tr>

            {/* ALTERNATIVES */}

            <tr>

              <td>

                <div className="table-label">
                  Were alternatives to procurement considered?
                </div>

              </td>

              <td>

                <YesNoField
                  value={formData.alternativesConsidered}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      alternativesConsidered: value
                    })
                  }
                />

              </td>

            </tr>

            {/* ALTERNATIVE DETAILS */}

            <tr>

              <td colSpan="2">

                <div className="table-description">
                  If yes, please elaborate below:
                </div>

                <TextAreaField
                  value={formData.alternativeDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      alternativeDetails: e.target.value
                    })
                  }
                />

              </td>

            </tr>

            {/* APPROVAL */}

            <tr>

              <td>

                <div className="table-label">
                  Has AAFC functional approval been obtained, if applicable?
                </div>

              </td>

              <td>

                <YesNoField
                  value={formData.functionalApproval}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      functionalApproval: value
                    })
                  }
                />

              </td>

            </tr>

          </tbody>

        </table>

      </Section>

    </FormLayout>

  )
}

export default Page1