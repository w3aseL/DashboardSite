import React, { useState } from "react"
import classnames from "classnames"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Form, FormGroup, Input, FormText, Label } from "reactstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons"

import { request } from "../../api"

// HELPER FUNCTIONS
const checkGPA = gpa => typeof(gpa) === "number" && gpa >= 0.00 && gpa <= 5.00

/**
 * AddEducationModal Component
 */
const AddEducationModal = ({ toggle, isOpen }) => {
  const initialForm = {
    school_name: "",
    school_type: "",
    graduation_reward: "",
    major: "",
    logo_id: "",
    graduation_date: new Date(),
    gpa: 0.00
  }

  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const updateImage = e => {
    setImage(e.target.files[0])
  }

  const updateField = (field, value) => {
    const newForm = { ...form }

    newForm[field] = value

    setForm(newForm)
  }

  const uploadImage = e => {
    e.preventDefault()

    if(!image)
      return

    var formData = new FormData()
    formData.append("logo", image)

    setState({ ...state, loading: true })

    request("/portfolio/education/upload-image", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      updateField("logo_id", res.data.id)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const validateForm = () => {
    let valid = true

    Object.keys(form).forEach(key => {
      if(typeof(form[key]) === "string" && key !== "major" && form[key].length === 0)
        valid = false
      else if(typeof(form[key]) === "number" && key === "gpa" && !checkGPA(form[key]))
        valid = false
    })

    return valid
  }

  const submitData = e => {
    e.preventDefault()

    if(!validateForm())
      return

    setState({ ...state, loading: true, data: null, error: null })

    request("/portfolio/education", form, "POST", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      closeModal()
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const closeModal = (refresh=false) => {
    setState({ ...state, loading: false, data: null, error: null })
    setForm(initialForm)

    toggle(refresh)
  }

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Add Info</ModalHeader>
      <ModalBody>
        <Form>
          <Container>
            <Row>
              <Col sm="4">
                <img src={image ? URL.createObjectURL(image) : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"} width="100%" height="auto" />
              </Col>
              <Col sm="8">
                <h4 className="text-center w-100">Upload Logo</h4>
                <FormGroup>
                  <Input type="file" name="logo" id="logo" onChange={e => updateImage(e)} />
                  <FormText>Image Identifier: {form.logo_id ? form.logo_id : "N/A"}</FormText>
                </FormGroup>
                <div className="w-100 d-flex">
                  <Button size="sm" className="ml-auto mr-0" onClick={e => uploadImage(e)}>Upload Image</Button>
                </div>
              </Col>
            </Row>
            <hr />
            <FormGroup>
              <Label for="schoolName">School Name</Label>
              <Input type="text" name="schoolName" id="schoolName" placeholder="Enter school name..." onChange={e => updateField("school_name", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="schoolType">School Type</Label>
              <Input type="text" name="schoolType" id="schoolType" placeholder="Enter school type..." onChange={e => updateField("school_type", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="reward">Reward</Label>
              <Input type="text" name="reward" id="reward" placeholder="Enter reward..." onChange={e => updateField("graduation_reward", e.target.value)} />
              <FormText>E.g. Diploma, Bachelor's Degree</FormText>
            </FormGroup>
            <FormGroup>
              <Label for="major">Major</Label>
              <Input type="text" name="major" id="major" placeholder="Enter major..." onChange={e => updateField("major", e.target.value)} />
              <FormText>If applicable</FormText>
            </FormGroup>
            <FormGroup>
              <Label for="gpa">GPA</Label>
              <Input valid={checkGPA(form.gpa)} invalid={!checkGPA(form.gpa)} type="text" name="gpa" id="gpa" placeholder="Enter grade-point average..." onChange={e => updateField("gpa", parseFloat(e.target.value))} />
              <FormText>Only in range of 0.00 to 5.00</FormText>
            </FormGroup>
            <FormGroup>
              <Label for="graduationDate">Graduation Date</Label>
              <Input type="date" name="graduationDate" id="graduationDate" onChange={e => updateField("graduation_date", e.target.value)} />
            </FormGroup>
          </Container>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => submitData(e)}>Create</Button>
      </ModalFooter>
    </Modal>
  )
}

/**
 * EditEducationModal Component
 * 
 * TODO: Make it work
 */
const EditEducationModal = ({ toggle, isOpen, id }) => {
  const initialForm = {
    school_name: "",
    school_type: "",
    graduation_reward: "",
    major: "",
    logo_id: "",
    graduation_date: new Date(),
    gpa: 0.00
  }
  
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const updateImage = e => {
    setImage(e.target.files[0])
  }

  const updateField = (field, value) => {
    const newForm = { ...form }

    newForm[field] = value

    setForm(newForm)
  }

  const uploadImage = e => {
    e.preventDefault()

    if(!image)
      return

    var formData = new FormData()
    formData.append("logo", image)

    setState({ ...state, loading: true })

    request("/portfolio/education/upload-image", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      updateField("logo_id", res.data.id)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const validateForm = () => {
    let valid = true

    Object.keys(form).forEach(key => {
      if(typeof(form[key]) === "string" && key !== "major" && form[key].length === 0)
        valid = false
      else if(typeof(form[key]) === "number" && key === "gpa" && !checkGPA(form[key]))
        valid = false
    })

    return valid
  }

  const submitData = e => {
    e.preventDefault()

    if(!validateForm())
      return

    setState({ ...state, loading: true, data: null, error: null })

    request(`/portfolio/education/${id}`, form, "PATCH", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const deleteEducation = e => {
    e.preventDefault()

    setState({ loading: true, data: null, error: null })

    request(`/portfolio/education`, { id }, "DELETE", true)
    .then(res => {
      setState({ loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  if(id && !state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/portfolio/education/${id}`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const closeModal = (refresh=false) => {
    setState({ ...state, loading: false, data: null, error: null })
    setForm(initialForm)

    toggle(refresh)
  }

  //console.log(state)

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Edit Info</ModalHeader>
      <ModalBody>
        {/*<Form>
          <Container>
            <Row>
              <Col sm="4">
                <img src={image ? URL.createObjectURL(image) : (state.data && state.data.school_logo ? state.data.school_logo : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")} width="100%" height="auto" />
              </Col>
              <Col sm="8">
                <h4 className="text-center w-100">Upload Logo</h4>
                <FormGroup>
                  <Input type="file" name="logo" id="logo" onChange={e => updateImage(e)} />
                  <FormText>Image Identifier: {form.logo_id ? form.logo_id : (state.data && state.data.logo_id ? state.data.logo_id : "N/A")}</FormText>
                </FormGroup>
                <div className="w-100 d-flex">
                  <Button disabled size="sm" className="ml-auto mr-0" onClick={e => uploadImage(e)}>Upload Image</Button>
                </div>
              </Col>
            </Row>
            <hr />
            <FormGroup>
              <Label for="schoolName">School Name</Label>
              <Input type="text" name="schoolName" id="schoolName" placeholder="Enter school name..." defaultValue={state.data && state.data.school_name} onChange={e => updateField("school_name", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="schoolType">School Type</Label>
              <Input type="text" name="schoolType" id="schoolType" placeholder="Enter school type..." defaultValue={state.data && state.data.school_type} onChange={e => updateField("school_type", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="reward">Reward</Label>
              <Input type="text" name="reward" id="reward" placeholder="Enter reward..." defaultValue={state.data && state.data.graduation_reward} onChange={e => updateField("graduation_reward", e.target.value)} />
              <FormText>E.g. Diploma, Bachelor's Degree</FormText>
            </FormGroup>
            <FormGroup>
              <Label for="major">Major</Label>
              <Input type="text" name="major" id="major" placeholder="Enter major..." defaultValue={state.data && state.data.major} onChange={e => updateField("major", e.target.value)} />
              <FormText>If applicable</FormText>
            </FormGroup>
            <FormGroup>
              <Label for="gpa">GPA</Label>
              <Input valid={checkGPA(form.gpa)} invalid={!checkGPA(form.gpa)} type="text" name="gpa" id="gpa" placeholder="Enter grade-point average..."  defaultValue={state.data && state.data.gpa} onChange={e => updateField("gpa", parseFloat(e.target.value))} />
              <FormText>Only in range of 0.00 to 5.00</FormText>
            </FormGroup>
            <FormGroup>
              <Label for="graduationDate">Graduation Date</Label>
              <Input type="date" name="graduationDate" id="graduationDate" defaultValue={state.data && state.data.graduation_date} onChange={e => updateField("graduation_date", e.target.value)} />
            </FormGroup>
          </Container>
        </Form>*/}
        <h4 className="w-100 text-center">Coming in Phase 2 Update!</h4>
        <p className="w-100 text-center text-muted">Click the delete button to delete the selected one if you wish to delete it.</p>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => deleteEducation(e)} color="danger"><FontAwesomeIcon icon={faTrash} /></Button>
        <Button disabled className="float-left" onClick={e => submitData(e)}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

const EducationCard = ({ data, toggleEditModal }) => {
  const { id, school_name, school_logo, school_type, graduation_date, graduation_reward, major, gpa } = data

  const gradDate = new Date(graduation_date), hasGraduated = gradDate < new Date()

  const dateToStr = date => `${date.getMonth()+1}/${date.getFullYear()}`

  const majorAndRewardProcess = (reward, major) => {
    if(!major)
      return reward

    if(reward.toLowerCase().includes("bachelor") || reward.toLowerCase().includes("bs")) {
      return `B.S. in ${major}`
    }
  }

  return (
    <Card>
      <Container className="mt-2 mb-2">
        <Row className="d-flex">
          <Col sm="3" className="ml-sm-auto mr-sm-auto">
            <img width="100%" height="auto" src={school_logo}></img>
          </Col>
          <Col sm="9" className="ml-sm-auto mr-sm-auto">
            <h4 className="w-auto pb-0 mb-0"><em>{school_name}</em></h4>
            <p className="text-muted">{school_type}</p>
          </Col>
        </Row>
        <Row className="d-flex">
          <Col sm="8">
            <p className="w-100 text-muted">
              {`${majorAndRewardProcess(graduation_reward, major)}`}
              <br/>
              {`${gpa} GPA`}
              <br/>
              {`${!hasGraduated ? "Expected " : ""} ${dateToStr(gradDate)}`}
            </p>
          </Col>
          <Col sm="4" className="d-flex">
            <Button className="ml-auto mr-0 mt-auto mb-3" onClick={e => toggleEditModal(e, id)}><FontAwesomeIcon icon={faPencilAlt} /></Button>
          </Col>
        </Row>
      </Container>
    </Card>
  )
}

export const EducationTab = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [modal, setModal] = useState({
    addModal: false,
    editModal: false
  })
  const [editIdentifer, setEditIdentifier] = useState(null)

  const toggleModal = (modalName, refresh=false) => {
    const modalState = { ...modal }

    modalState[modalName] = !modal[modalName]

    setModal(modalState)

    if(refresh) {
      setState({ ...state, loading: false, data: null, error: null })
    }
  }

  const openAddModal = e => {
    e.preventDefault()

    // Open modal
    toggleModal("addModal")
  }

  const openEditModal = (e, id) => {
    e.preventDefault()

    setEditIdentifier(id)

    // Open modal
    toggleModal("editModal")
  }

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/portfolio/education`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  //console.log(state)

  return (
    <>
      <AddEducationModal toggle={(refresh=false) => toggleModal("addModal", refresh)} isOpen={modal.addModal} />
      <EditEducationModal toggle={(refresh=false) => toggleModal("editModal", refresh)} isOpen={modal.editModal} id={editIdentifer} />
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Education</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button className="ml-auto mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <>
              {state.data.education.length == 0 && 
                <h4 className="w-100 text-muted text-center"><em>No education data found...</em></h4>
              }
              {state.data.education.map((obj, i) => (
                <Col md="6" className={`ml-auto mr-auto${i > 1 ? " mt-3" : ""}`}>
                  <EducationCard data={obj} toggleEditModal={openEditModal} />
                </Col>
              ))}
            </>
          :
            <h1 className="w-100">Loading...</h1>
          }
        </Row>
      </Container>
    </>
  )
}