import React, { useState, useRef, useEffect } from "react"
import classnames from "classnames"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Form, FormGroup, Input, FormText, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import MDEditor from "@uiw/react-md-editor"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons"

import { request } from "../../api"

const NO_IMG_URL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"

const AddToolModal = ({ isOpen, toggle }) => {
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    logo_id: "",
    category: ""
  })
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState(null)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [categories, setCategories] = useState({
    data: null,
    error: null
  })
  const [dropdown, setDropdown] = useState(false)

  useEffect(() => {
    updateField("description", description)
  }, [description])

  const toggleDropdown = () => setDropdown(prevState => !prevState)

  const closeModal = (refresh=false) => {
    setForm({
      name: "",
      url: "",
      description: "",
      logo_id: "",
      category: ""
    })
    setDescription("")
    setLogo(null)
    setState({
      loading: false,
      data: null,
      error: null
    })
    setCategories({
      data: null,
      error: null
    })
    setDropdown(false)

    toggle(refresh)
  }

  const updateImage = e => {
    setLogo(e.target.files[0])
  }

  const updateField = (field, value) => {
    var newForm = { ...form }

    newForm[field] = value

    setForm(newForm)
  }

  const uploadImage = e => {
    e.preventDefault()

    if(!logo)
      return

    var formData = new FormData()
    formData.append("logo", logo)

    setState({ loading: true })

    request("/portfolio/tool/upload-image", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ loading: false, data: res.data })

      updateField("logo_id", res.data.id)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  const validateForm = () => {
    if(description !== "")
      updateField("description", description)

    let valid = true

    Object.keys(form).forEach(key => {
      if(typeof(form[key]) === "string" && (key !== "category" || key !== "logo_id") && form[key].length === 0)
        valid = false
    })

    return valid
  }

  const submitData = e => {
    e.preventDefault()

    if(!validateForm())
      return

    setState({ loading: true, data: null, error: null })

    request("/portfolio/tool", form, "POST", true)
    .then(res => {
      setState({ loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  if(!categories.data) {
    request("/portfolio/category", null, "GET", true)
    .then(res => {
      setCategories({ data: res.data.categories })
    })
    .catch(err => setCategories({ error: err }))
  }

  return (
    <Modal size="lg" isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Add Tool</ModalHeader>
      <ModalBody>
        <Form>
          <Container>
            <Row className="d-flex">
              <Col sm="4" md="2" className="ml-auto mr-0">
                <img src={logo ? URL.createObjectURL(logo) : NO_IMG_URL} width="100%" height="auto" />
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
              <Label>Category</Label>
              <Row>
                <Col md="6" sm="12">
                  <Dropdown className="ml-auto mr-auto" color="primary" isOpen={dropdown} toggle={toggleDropdown}>
                    <DropdownToggle caret>
                      {!form.category ? "New Category" : form.category}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={e => updateField("category", "")}>New Category</DropdownItem>
                      {categories.data && categories.data.length > 0 && categories.data.map((obj, i) => (
                        <DropdownItem onClick={e => updateField("category", obj)}>{obj}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col md="6" sm="12">
                  <Input type="text" name="category" id="category" value={form.category} placeholder="Enter name of category..." onChange={e => updateField("category", e.target.value)} />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label for="toolName">Name</Label>
              <Input type="text" name="toolName" id="toolName" placeholder="Enter name of tool..." onChange={e => updateField("name", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="url">URL</Label>
              <Input type="text" name="url" id="url" placeholder="Enter url to tool website..." onChange={e => updateField("url", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <MDEditor id="description" onChange={setDescription} />
              <FormText>Describe proper experience with tool.</FormText>
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

const EditToolModal = ({ isOpen, toggle, id }) => {
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    logo_id: "",
    category: ""
  })
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState(null)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [categories, setCategories] = useState({
    data: null,
    error: null
  })
  const [dropdown, setDropdown] = useState(false)
  const [loaded, setLoaded] = useState({
    isLoaded: false,
    original_data: null,
    logo_url: "",
    error: null
  })

  useEffect(() => {
    updateField("description", description)
  }, [description])

  const toggleDropdown = () => setDropdown(prevState => !prevState)

  const closeModal = (refresh=false) => {
    setForm({
      name: "",
      url: "",
      description: "",
      logo_id: "",
      category: ""
    })
    setDescription("")
    setLogo(null)
    setState({
      loading: false,
      data: null,
      error: null
    })
    setCategories({
      data: null,
      error: null
    })
    setDropdown(false)
    setLoaded({
      isLoaded: false,
      original_data: null,
      logo_url: "",
      error: null
    })

    toggle(refresh)
  }

  const updateImage = e => {
    setLogo(e.target.files[0])
  }

  const updateField = (field, value) => {
    var newForm = { ...form }

    newForm[field] = value

    setForm(newForm)
  }

  const uploadImage = e => {
    e.preventDefault()

    if(!logo)
      return

    var formData = new FormData()
    formData.append("logo", logo)

    setState({ loading: true })

    request("/portfolio/tool/upload-image", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ loading: false, data: res.data })

      updateField("logo_id", res.data.id)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  const validateFormAndCondense = () => {
    if(description !== "")
      updateField("description", description)

    let valid = true, condensedForm = {}

    Object.keys(form).forEach(key => {
      if(typeof(form[key]) === "string" && (key !== "category" || key !== "logo_id") && form[key].length === 0)
        valid = false
      else if(typeof(form[key]) === "string" && form[key].length > 0 && form[key] !== loaded.original_data[key])
        condensedForm[key] = form[key]
    })

    return { condensedForm, isValid: valid }
  }

  const submitData = e => {
    e.preventDefault()

    const { condensedForm, isValid } = validateFormAndCondense()

    if(!isValid) return

    setState({ loading: true, data: null, error: null })

    request(`/portfolio/tool/${id}`, condensedForm, "PATCH", true)
    .then(res => {
      setState({ loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  const deleteTool = e => {
    e.preventDefault()

    setState({ loading: true, data: null, error: null })

    request(`/portfolio/tool`, { id }, "DELETE", true)
    .then(res => {
      setState({ loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  if(!categories.data) {
    request("/portfolio/category", null, "GET", true)
    .then(res => {
      setCategories({ data: res.data.categories })
    })
    .catch(err => setCategories({ error: err }))
  }

  if(!loaded.isLoaded && isOpen) {
    request(`/portfolio/tool/${id}`, null, "GET", true)
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

  return (
    <Modal size="lg" isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Edit Tool</ModalHeader>
      <ModalBody>
        <Form>
          <Container>
            <Row className="d-flex">
              <Col sm="4" md="2" className="ml-auto mr-0">
                <img src={loaded.logo_url ? loaded.logo_url : (logo ? URL.createObjectURL(logo) : NO_IMG_URL)} width="100%" height="auto" />
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
              <Label>Category</Label>
              <Row>
                <Col md="6" sm="12">
                  <Dropdown className="ml-auto mr-auto" color="primary" isOpen={dropdown} toggle={toggleDropdown}>
                    <DropdownToggle caret>
                      {!form.category ? "New Category" : form.category}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={e => updateField("category", "")}>New Category</DropdownItem>
                      {categories.data && categories.data.length > 0 && categories.data.map((obj, i) => (
                        <DropdownItem onClick={e => updateField("category", obj)}>{obj}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col md="6" sm="12">
                  <Input type="text" name="category" id="category" value={form.category} placeholder="Enter name of category..." onChange={e => updateField("category", e.target.value)} />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label for="toolName">Name</Label>
              <Input type="text" name="toolName" id="toolName" value={form.name} placeholder="Enter name of tool..." onChange={e => updateField("name", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="url">URL</Label>
              <Input type="text" name="url" id="url" value={form.url} placeholder="Enter url to tool website..." onChange={e => updateField("url", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <MDEditor id="description" value={description} onChange={setDescription} />
              <FormText>Describe proper experience with tool.</FormText>
            </FormGroup>
          </Container>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => deleteTool(e)} color="danger"><FontAwesomeIcon icon={faTrash} /></Button>
        <Button className="float-left" onClick={e => submitData(e)}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

const ToolCard = ({ tool, toggleModal }) => {
  const { id, name, url, description, logo_url, category } = tool

  return (    
    <Card>
      <Container className="mt-2 mb-2">
        <Row>
          <Col sm="3">
            <img width="100%" height="auto" src={logo_url ? logo_url : NO_IMG_URL}></img>
          </Col>
          <Col sm="6">
            <h4 className="w-auto pb-0 mb-0"><em><a href={url} target="_blank">{name}</a></em></h4>
            {category && <p className="text-muted">{category}</p>}
          </Col>
          <Col sm="3" className="d-flex">
            <Button className="ml-auto mr-0 mt-0 mb-auto" onClick={e => toggleModal(e, id)}><FontAwesomeIcon icon={faPencilAlt} /></Button>
          </Col>
        </Row>
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

export const ToolTab = props => {
  const [modal, setModal] = useState({
    addModal: false,
    editModal: false
  })
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [editIdentifier, setEditIdentifier] = useState(-1)

  const toggleModal = (modalName, refresh=false) => {
    if(refresh)
      setState({ ...state, loading: false, data: null, error: null })

    var modalState = { ...modal }

    modalState[modalName] = !modal[modalName]

    setModal(modalState)
  }

  const openAddModal = e => {
    e.preventDefault()

    toggleModal("addModal")
  }

  const openEditModal = (e, id) => {
    e.preventDefault()

    toggleModal("editModal")
    setEditIdentifier(id)
  }

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/portfolio/tool`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  // console.log(state)

  return (
    <>
      <AddToolModal isOpen={modal.addModal} toggle={(refresh=false) => toggleModal("addModal", refresh)} />
      <EditToolModal isOpen={modal.editModal} toggle={(refresh=false) => toggleModal("editModal", refresh)} id={editIdentifier} />
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Tools</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button className="ml-auto mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <>
              {state.data.tools.length == 0 && 
                <h4 className="w-100 text-muted text-center"><em>No tool data found...</em></h4>
              }
              {state.data.tools.length > 0 && state.data.tools.map((tool, i) => (
                <Col md="6" className={`ml-auto mr-auto${i > 1 ? " mt-3" : ""}`}>
                  <ToolCard tool={tool} toggleModal={(e, id) => openEditModal(e, id)} />
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