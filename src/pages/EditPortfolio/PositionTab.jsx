import React, { useState, useRef, useEffect } from "react"
import classnames from "classnames"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Form, FormGroup, Input,
  FormText, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import MDEditor from "@uiw/react-md-editor"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencilAlt, faTrash, faArrowCircleRight } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"

import { request } from "../../api"

const NO_IMG_URL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"

const AddPositionModal = ({ isOpen, toggle }) => {
  const initialForm = {
    job_title: "",
    company_name: "",
    company_url: "",
    description: "",
    start_date: "",
    end_date: "",
    logo_id: ""
  }
  
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState("")
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const updateField = (field, value) => {
    setForm(prevForm => ({ ...prevForm, [field]: value }))
  }

  useEffect(() => {
    updateField("description", description)
  }, [description])

  const updateImage = e => {
    setImage(e.target.files[0])
  }

  const uploadImage = e => {
    e.preventDefault()

    if(!image)
      return

    var formData = new FormData()
    formData.append("logo", image)

    setState({ ...state, loading: true })

    request("/portfolio/position/upload-image", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      updateField("logo_id", res.data.id)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const validateForm = () => {
    let valid = true

    Object.keys(form).forEach(key => {
      if(typeof(form[key]) === "string" && (key !== "company_url") && form[key].length === 0)
        valid = false
    })

    return valid
  }

  const submitData = e => {
    e.preventDefault()

    if(!validateForm())
      return

    setState({ ...state, loading: true, data: null, error: null })

    request("/portfolio/position", form, "POST", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      closeModal()
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const closeModal = (refresh=false) => {
    setForm(initialForm)
    setImage(null)
    setDescription("")
    setState({
      loading: false,
      data: null,
      error: null
    })

    toggle(refresh)
  }

  return (
    <Modal size="lg" isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Add Position</ModalHeader>
      <ModalBody>
        <Form>
          <Container>
            <Row className="d-flex mt-2">
              <Col sm="4" md="2" className="ml-auto mr-0 d-flex">
                <img className="mt-auto mb-auto" src={image ? URL.createObjectURL(image) : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"} width="100%" height="auto" />
              </Col>
              <Col sm="8" md="4" className="ml-0 mr-auto">
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
              <Label for="jobTitle">Job Title</Label>
              <Input type="text" name="jobTitle" id="jobTitle" placeholder="Enter job title..." value={form.company_url} onChange={e => updateField("job_title", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="companyName">Company Name</Label>
              <Input type="text" name="companyName" id="companyName" value={form.company_name} placeholder="Enter company name..." onChange={e => updateField("company_name", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="companyUrl">Company URL</Label>
              <Input type="text" name="companyUrl" id="companyUrl" value={form.company_url} placeholder="Enter company url..." onChange={e => updateField("company_url", e.target.value)} />
              <FormText>If applicable</FormText>
            </FormGroup>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input type="date" name="startDate" id="startDate" value={form.start_date} onChange={e => updateField("start_date", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input type="date" name="endDate" id="endDate" value={form.end_date} onChange={e => updateField("end_date", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <MDEditor id="description" value={description} onChange={setDescription} />
              <FormText>Describe responsibilities of the job.</FormText>
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

const EditPositionModal = ({ isOpen, toggle, id }) => {
  const initialForm = {
    job_title: "",
    company_name: "",
    company_url: "",
    description: "",
    start_date: "",
    end_date: "",
    logo_id: ""
  }
  
  const [form, setForm] = useState(initialForm)
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState("")
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [loaded, setLoaded] = useState({
    isLoaded: false,
    original_data: null,
    logo_url: "",
    error: null
  })

  const updateField = (field, value) => {
    setForm(prevForm => ({ ...prevForm, [field]: value }))
  }

  useEffect(() => {
    updateField("description", description)
  }, [description])

  const updateImage = e => {
    setImage(e.target.files[0])
  }

  const uploadImage = e => {
    e.preventDefault()

    if(!image)
      return

    var formData = new FormData()
    formData.append("logo", image)

    setState({ ...state, loading: true })

    request("/portfolio/position/upload-image", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      updateField("logo_id", res.data.id)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const validateFormAndCondense = () => {
    let valid = true, condensedForm = {}

    const excludedKeys = [ "company_url", "logo_id", "end_date" ]

    Object.keys(form).forEach(key => {
      if(typeof(form[key]) === "string" && !excludedKeys.includes(key) && form[key].length === 0) {
        valid = false
      } else if(typeof(form[key]) === "string" && form[key].length > 0 && form[key] !== loaded.original_data[key])
        condensedForm[key] = form[key]
    })

    console.log(condensedForm, valid)

    return { condensedForm, isValid: valid }
  }

  const submitData = e => {
    e.preventDefault()

    const { condensedForm, isValid } = validateFormAndCondense()

    if(!isValid) return

    setState({ loading: true, data: null, error: null })

    request(`/portfolio/position/${id}`, condensedForm, "PATCH", true)
    .then(res => {
      setState({ loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  const deletePosition = e => {
    e.preventDefault()

    setState({ loading: true, data: null, error: null })

    request(`/portfolio/position`, { id }, "DELETE", true)
    .then(res => {
      setState({ loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  if(!loaded.isLoaded && isOpen) {
    request(`/portfolio/position/${id}`, null, "GET", true)
    .then(res => {
      const formKeys = Object.keys(form), dataKeys = Object.keys(res.data)
      var newForm = { ...form }

      dataKeys.forEach(key => {
        if(formKeys.includes(key)) {
          newForm[key] = res.data[key]
        }
      })

      setForm(newForm)

      if(res.data.description)
        setDescription(res.data.description)

      setLoaded({ isLoaded: true, logo_url: res.data.logo_url, original_data: res.data })
    })
    .catch(err => setLoaded({ error: err }))
  }

  const closeModal = (refresh=false) => {
    setForm(initialForm)
    setImage(null)
    setDescription("")
    setState({
      loading: false,
      data: null,
      error: null
    })
    setLoaded({
      isLoaded: false,
      original_data: null,
      logo_url: "",
      error: null
    })

    toggle(refresh)
  }

  return (
    <Modal size="lg" isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Edit Position</ModalHeader>
      <ModalBody>
        <Form>
          <Container>
            <Row className="d-flex mt-2">
              <Col sm="4" md="2" className="ml-auto mr-0 d-flex">
                <img className="mt-auto mb-auto" src={loaded.logo_url ? loaded.logo_url : (image ? URL.createObjectURL(image) : NO_IMG_URL)} width="100%" height="auto" />
              </Col>
              <Col sm="8" md="4" className="ml-0 mr-auto">
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
              <Label for="jobTitle">Job Title</Label>
              <Input type="text" name="jobTitle" id="jobTitle" placeholder="Enter job title..." value={form.job_title} onChange={e => updateField("job_title", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="companyName">Company Name</Label>
              <Input type="text" name="companyName" id="companyName" value={form.company_name} placeholder="Enter company name..." onChange={e => updateField("company_name", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="companyUrl">Company URL</Label>
              <Input type="text" name="companyUrl" id="companyUrl" value={form.company_url} placeholder="Enter company url..." onChange={e => updateField("company_url", e.target.value)} />
              <FormText>If applicable</FormText>
            </FormGroup>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input type="date" name="startDate" id="startDate" value={form.start_date} onChange={e => updateField("start_date", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input type="date" name="endDate" id="endDate" value={form.end_date} onChange={e => updateField("end_date", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <MDEditor id="description" value={description} onChange={setDescription} />
              <FormText>Describe responsibilities of the job.</FormText>
            </FormGroup>
          </Container>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => deletePosition(e)} color="danger"><FontAwesomeIcon icon={faTrash} /></Button>
        <Button className="float-left" onClick={e => submitData(e)}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

const PositionCard = ({ position, toggleModal }) => {
  const { id, company_name, description, company_url, start_date, end_date, logo_url } = position

  const convertDateToString = dateStr => {
    if(!dateStr) return "Present"

    const date = new Date(dateStr)

    return `${date.getMonth()+1}/${date.getFullYear()}`
  }

  return (
    <Card>
      <Container className="mt-2 mb-2">
        <Row>
          <Col sm="3" className="d-flex">
            <img className="mt-auto mb-auto" width="100%" height="auto" src={logo_url ? logo_url : NO_IMG_URL}></img>
          </Col>
          <Col sm="7">
            <h4 className="w-auto pb-0 mb-0"><em>{company_url ? <a href={company_url} target="_blank">{company_name}</a> : <>{company_name}</>}</em></h4>
          </Col>
          <Col sm="2" className="d-flex">
            <Button className="ml-auto mr-0 mt-0 mb-auto" onClick={e => toggleModal(e, id)}><FontAwesomeIcon icon={faPencilAlt} /></Button>
          </Col>
        </Row>
        <p className="w-100 mt-2 mb-1">{convertDateToString(start_date)} - {convertDateToString(end_date)}</p>
        <p className="w-100 mt-2 mb-1 text-muted"><em>Description</em></p>
        <Row className="d-flex">
          <Col sm="12">
            <MDEditor.Markdown source={description} />
          </Col>
        </Row>
      </Container>
    </Card>
  )
}

export const PositionTab = props => {
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

    request(`/portfolio/position`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <>
      <AddPositionModal toggle={(refresh=false) => toggleModal("addModal", refresh)} isOpen={modal.addModal} />
      <EditPositionModal toggle={(refresh=false) => toggleModal("editModal", refresh)} isOpen={modal.editModal} id={editIdentifer} />
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Positions</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button className="ml-auto mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <>
              {state.data.positions.length == 0 && 
                <h4 className="w-100 text-muted text-center"><em>No position data found...</em></h4>
              }
              {state.data.positions.map((obj, i) => (
                <Col md="6" className={`ml-auto mr-auto${i > 1 ? " mt-3" : ""}`}>
                  <PositionCard position={obj} toggleModal={openEditModal} />
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