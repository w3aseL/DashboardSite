import React, { useState } from "react"
import classnames from "classnames"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Form, FormGroup, Input, FormText, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons"

import { request } from "../../api"

const AddResumeModal = ({ isOpen, toggle }) => {
  const [form, setForm] = useState({
    resume_id: "",
    creation_date: new Date()
  })
  const [file, setFile] = useState(null)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const updateFile = e => {
    e.preventDefault()

    setFile(e.target.files[0])
  }

  const updateField = (field, value) => {
    var newForm = { ...form }

    newForm[field] = value

    setForm(newForm)
  }

  const uploadResume = e => {
    e.preventDefault()

    if(!file)
      return

    var formData = new FormData()
    formData.append("resume", file)

    setState({ ...state, loading: true })

    request("/portfolio/resume", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ ...state, loading: false })

      updateField("resume_id", res.data.id)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const updateResume = e => {
    e.preventDefault()

    setState({ ...state, loading: true })

    request(`/portfolio/resume/${form.resume_id}`, { date: form.creation_date }, "PATCH", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }
  
  const closeModal = (refresh=false) => {
    setForm({ resume_id: "", creation_date: "" })
    setFile(null)
    setState({ loading: false, data: null, error: null })

    toggle(refresh)
  }

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Upload Resume</ModalHeader>
      <ModalBody>
        <Container>
          <Form>
            <Row>
              <Col sm="12">
                <h4 className="text-center w-100">Upload Resume</h4>
                <FormGroup>
                  <Input type="file" name="logo" id="logo" onChange={e => updateFile(e)} />
                  <FormText>Resume Identifier: {form.resume_id ? form.resume_id : "N/A"}</FormText>
                </FormGroup>
                <div className="w-100 d-flex">
                  <Button size="sm" className="ml-auto mr-0" onClick={e => uploadResume(e)}>Upload Resume</Button>
                </div>
              </Col>
            </Row>
            {form.resume_id !== "" &&
              <>
                <hr/>
                <Row>
                  <Col sm="12">
                    <FormGroup>
                      <Label for="creationDate">Creation Date</Label>
                      <Input type="date" name="creationDate" id="creationDate" defaultValue={form.creation_date} onChange={e => updateField("creation_date", e.target.value)} />
                    </FormGroup>
                  </Col>
                </Row>
              </>
            }
          </Form>
        </Container>
      </ModalBody>
      {form.resume_id !== "" && 
        <ModalFooter>
          <Button className="float-left" onClick={e => updateResume(e)}>Create</Button>
        </ModalFooter>
      }
    </Modal>
  )
}

const DeleteResumeModal = ({ isOpen, toggle, resume }) => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  
  const closeModal = (refresh=false) => {
    setState({
      loading: false,
      data: null,
      error: null
    })

    toggle(refresh)
  }

  const deleteResume = e => {
    e.preventDefault()

    setState({ ...state, loading: true })

    request("/portfolio/resume", { id: resume.id }, "DELETE", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Delete Resume</ModalHeader>
      <ModalBody>
        <Container>
          <Row>
            <Col sm="12">
              <h4 className="text-center"><em>{resume && resume.file_name ? resume.file_name : "TBD"}</em></h4>
              <p className="w-100 text-center text-muted mb-1">Resume Identifier: {resume && resume.id ? resume.id : "N/A"}</p>
              <p className="w-100 text-center text-danger mb-1"><em>Delete this resume?</em></p>
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" className="float-left" onClick={e => deleteResume(e)}>Delete</Button>
      </ModalFooter>
    </Modal>
  )
}

export const ResumeTab = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [modal, setModal] = useState({
    addModal: false,
    deleteModal: false
  })
  const [resume, setResume] = useState(null)
  const [dropdown, setDropdown] = useState(false)

  const toggleModal = (modalName, refresh=false) =>{ 
    if(refresh)
      setState({ ...state, loading: false, data: null, error: null })

    setModal(prevState => ({ ...prevState, [modalName]: !prevState[modalName] }))
  }

  const openAddModal = e => {
    e.preventDefault()

    toggleModal("addModal")
  }

  const openDeleteModal = e => {
    e.preventDefault()

    if(!resume)
      return

    toggleModal("deleteModal")
  }

  const toggleDropdown = () => setDropdown(prevState => !prevState)

  const updateSelectedResume = (e, selected) => {
    e.preventDefault()

    setResume(selected)
  }

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/portfolio/resume`, null, "GET", true)
    .then(res => {
      setResume(null)
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  if(state.data && state.data.resumes && state.data.resumes.length > 0 && !resume)
    setResume(state.data.resumes[0])

  console.log(state)

  return (
    <>
      <AddResumeModal isOpen={modal.addModal} toggle={(refresh=false) => toggleModal("addModal", refresh)} />
      <DeleteResumeModal isOpen={modal.deleteModal} toggle={(refresh=false) => toggleModal("deleteModal", refresh)} resume={resume} />
      <Container className="mt-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Resumes</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button disabled={!resume} color="danger" className="ml-auto mr-2" onClick={e => openDeleteModal(e)}><FontAwesomeIcon icon={faTrash} /></Button>
            <Button className="ml-2 mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <>
              {state.data.resumes.length == 0 && 
                <h4 className="w-100 text-muted text-center"><em>No resume data found...</em></h4>
              }
              <div className="d-flex w-100 mb-2">
                <Dropdown className="ml-auto mr-auto" color="primary" isOpen={dropdown} toggle={toggleDropdown}>
                  <DropdownToggle caret>
                    {!resume ? "Select Image" : resume.file_name}
                  </DropdownToggle>
                  <DropdownMenu>
                    {state.data.resumes.length === 0 &&
                      <DropdownItem disabled>N/A</DropdownItem>
                    }
                    {state.data.resumes.length > 0 && state.data.resumes.map((obj, i) => (
                      <DropdownItem onClick={e => updateSelectedResume(e, obj)}>{obj.file_name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              {resume &&
                <Col md="10" className="ml-auto mr-auto">
                  <embed src={resume.url} type="application/pdf" width="100%" height="500px" />
                </Col>
              }
            </>
          :
            <h1 className="w-100">Loading...</h1>
          }
        </Row>
      </Container>
    </>
  )
}