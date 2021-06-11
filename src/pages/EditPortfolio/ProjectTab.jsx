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

const AddProjectModal = ({ isOpen, toggle }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    url: "",
    repo_url: "",
    logo_id: "",
    images: [],
    tools: []
  })
  const [description, setDescription] = useState("")
  const [image, setImage] = useState({
    data: null,
    isLogo: false
  })
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [dropdown, setDropdown] = useState(false)
  const [urls, setUrls] = useState({
    logoUrl: "",
    imageUrls: []
  })
  const [activeTab, setActiveTab] = useState("addProject-0")
  const [inputKey, setInputKey] = useState(new Date())
  const [tools, setTools] = useState({
    data: null,
    error: null,
    selectedTool: null
  })

  const toggleDropdown = () => setDropdown(prevState => !prevState)

  const updateField = (field, value) => {
    var newForm = { ...form }

    newForm[field] = value

    setForm(newForm)
  }

  const addValueToFormArray = (field, value) => {
    var newForm = { ...form }

    newForm[field].push(value)

    setForm(newForm)
  }

  const updateStoredImageURLs = (url, isLogo=false) => {
    var newUrls = { ...urls }

    if(isLogo)
      newUrls.logoUrl = url
    else
      newUrls.imageUrls.push(url)

    setUrls(newUrls)
  }

  const updateImage = e => {
    setImage({ ...image, data: e.target.files[0] })
  }

  const setIsLogo = e => {
    setImage({ ...image, isLogo: e.target.checked })
  }

  const selectTool = tool => {
    setTools({ ...tools, selectedTool: tool })
  }

  const addTool = e => {
    e.preventDefault()

    addValueToFormArray("tools", tools.selectedTool.id)

    setTools({ ...tools, selectedTool: null })
  }

  const uploadImage = e => {
    e.preventDefault()

    if(!image.data)
      return

    var formData = new FormData()
    formData.append("image", image.data)
    if(image.isLogo)
      formData.append("is_logo", "true")

    setState({ loading: true })

    request("/portfolio/project/upload-image", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ loading: false, data: res.data })

      if(image.isLogo) {
        updateField("logo_id", res.data.id)
      } else {
        addValueToFormArray("images", res.data.id)
      }

      updateStoredImageURLs(res.data.url, image.isLogo)
      setImage({
        data: null,
        isLogo: false
      })

      setInputKey(new Date())
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  const validateForm = () => {
    let valid = true

    Object.keys(form).forEach(key => {
      if(typeof(form[key]) === "string" && (key !== "images" || key !== "tools" || key !== "logo_id") && form[key].length === 0)
        valid = false
    })

    return valid
  }

  const submitData = e => {
    e.preventDefault()

    if(!validateForm())
      return

    setState({ loading: true, data: null, error: null })

    request("/portfolio/project", form, "POST", true)
    .then(res => {
      setState({ loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  const closeModal = (refresh=false) => {
    if(refresh) {
      setForm({
        name: "",
        description: "",
        url: "",
        repo_url: "",
        logo_id: "",
        images: [],
        tools: []
      })
      setDescription("")
      setImage({
        data: null,
        isLogo: false
      })
      setState({
        loading: false,
        data: null,
        error: null
      })
      setDropdown(false)
      setUrls({
        logoUrl: "",
        imageUrls: []
      })
      setActiveTab("addProject-0")
      setInputKey(new Date())
      setTools({
        data: null,
        error: null,
        selectedTool: null
      })
    }

    toggle(refresh)
  }

  useEffect(() => {
    updateField("description", description)
  }, [description])

  if(!tools.data) {
    request("/portfolio/tool", null, "GET", true)
    .then(res => {
      setTools({ data: res.data.tools })
    })
    .catch(err => setTools({ error: err }))
  }

  return (
    <Modal size="lg" isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Add Project</ModalHeader>
      <ModalBody>
        <Container>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'addProject-0' })}
                onClick={() => { setActiveTab('addProject-0') }}
              >
                Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'addProject-1' })}
                onClick={() => { setActiveTab('addProject-1') }}
              >
                Images
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'addProject-2' })}
                onClick={() => { setActiveTab('addProject-2') }}
              >
                Tools
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="addProject-0">
              <Form>
                <FormGroup>
                  <Label for="projectName">Name</Label>
                  <Input type="text" name="projectName" id="projectName" placeholder="Enter name of project..." onChange={e => updateField("name", e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="projectURL">URL</Label>
                  <Input type="text" name="projectURL" id="projectURL" placeholder="Enter url of project..." onChange={e => updateField("url", e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="repoURL">Repository URL</Label>
                  <Input type="text" name="repoURL" id="repoURL" placeholder="Enter repository url of project..." onChange={e => updateField("repo_url", e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <MDEditor id="description" onChange={setDescription} />
                  <FormText>Describe functionality of project and responsibilities on it.</FormText>
                </FormGroup>
              </Form>
            </TabPane>
            <TabPane tabId="addProject-1">
              <Row className="d-flex mt-3">
                <Col sm="4" md="2" className="ml-auto mr-0">
                  <img src={image.data ? URL.createObjectURL(image.data) : NO_IMG_URL} width="100%" height="auto" />
                </Col>
                <Col sm="8" md="4" className="ml-0 mr-auto">
                  <h4 className="text-center w-100">Upload Image</h4>
                  <Form>
                    <FormGroup className="mb-1">
                      <Input key={inputKey} type="file" name="logo" id="logo" onChange={e => updateImage(e)} />
                    </FormGroup>
                    <FormGroup check>
                      <Label for="isLogo" className="mb-0">
                        <Input type="checkbox" name="isLogo" checked={image.isLogo} onChange={e => setIsLogo(e)} />{" "}
                        Is Logo
                      </Label>
                    </FormGroup>
                    <div className="w-100 d-flex">
                      <Button size="sm" className="ml-auto mr-0" onClick={e => uploadImage(e)}>Upload Image</Button>
                    </div>
                  </Form>
                </Col>
              </Row>
              <hr />
              <Row className="d-flex">
                <Col sm="3" className="ml-auto mr-auto mt-auto mb-auto">
                  <img src={urls.logoUrl ? urls.logoUrl : NO_IMG_URL} width="100%" height="auto" />
                  <p className="w-100 text-center text-muted">Logo</p>
                </Col>
                {urls.imageUrls.map((imgUrl, i) => (
                  <Col sm="3" className="ml-auto mr-auto mt-auto mb-auto">
                    <img src={imgUrl} width="100%" height="auto" />
                    <p className="w-100 text-center text-muted">Image #{i+1}</p>
                  </Col>
                ))}
              </Row>
            </TabPane>
            <TabPane tabId="addProject-2">
              <Row className="d-flex mt-3">
                <Col sm="4" md="2" className="ml-auto mr-0">
                  <img src={tools.selectedTool != null ? tools.selectedTool.logo_url : NO_IMG_URL} width="100%" height="auto" />
                </Col>
                <Col sm="8" md="4" className="ml-0 mr-auto">
                  <h4 className="text-center w-100">Add Tool</h4>
                  <Dropdown className="ml-auto mr-auto" color="primary" isOpen={dropdown} toggle={toggleDropdown}>
                    <DropdownToggle caret>
                      {tools.selectedTool != null ? tools.selectedTool.name : "Select One"}
                    </DropdownToggle>
                    <DropdownMenu>
                      {tools.data && tools.data.filter(tool => !form.tools.includes(tool.id)).length == 0 &&
                        <DropdownItem disabled>N/A</DropdownItem>
                      }
                      {tools.data && tools.data.length > 0 && tools.data.filter(tool => !form.tools.includes(tool.id)).map((tool, i) => (
                        <DropdownItem onClick={e => selectTool(tool)}>{tool.name}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <div className="w-100 d-flex">
                    <Button size="sm" className="ml-auto mr-0" onClick={e => addTool(e)}>Add Tool</Button>
                  </div>
                </Col>
              </Row>
              <hr/>
              <Row className="d-flex">
                {form.tools.map((id, i) => tools.data.find(tool => tool.id === id)).map((tool, i) => (
                  <Col sm="2" className="ml-auto mr-auto mt-auto mb-auto">
                    <img src={tool.logo_url} width="100%" height="auto" />
                    <p className="w-100 text-center mb-0">{tool.name}</p>
                    <p className="w-100 text-center text-muted mb-0"><em>{tool.category ? tool.category : "N/A"}</em></p>
                  </Col>
                ))}
              </Row>
            </TabPane>
          </TabContent>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => submitData(e)}>Create</Button>
      </ModalFooter>
    </Modal>
  )
}

const EditProjectModal = ({ isOpen, toggle, id }) => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  
  const deleteProject = e => {
    e.preventDefault()

    setState({ loading: true, data: null, error: null })

    request(`/portfolio/project`, { id }, "DELETE", true)
    .then(res => {
      setState({ loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ loading: false, error: err }))
  }

  const closeModal = (refresh=false) => {
    // Clear states
    setState({
      loading: false,
      data: null,
      error: null
    })

    toggle(refresh)
  }

  const submitData = e => {
    e.preventDefault()

    // Submit data
  }

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Add Project</ModalHeader>
      <ModalBody>
        <h4 className="w-100 text-center">Coming in Phase 2 Update!</h4>
        <p className="w-100 text-center text-muted">Click the delete button to delete the selected one if you wish to delete it.</p>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => deleteProject(e)} color="danger"><FontAwesomeIcon icon={faTrash} /></Button>
        <Button disabled className="float-left" onClick={e => submitData(e)}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

const ProjectCard = ({ project, toggleModal }) => {
  const { id, name, description, url, repo_url, logo_url } = project

  return (
    <Card>
      <Container className="mt-2 mb-2">
        <Row>
          <Col sm="3" className="d-flex">
            <img className="mt-auto mb-auto" width="100%" height="auto" src={logo_url ? logo_url : NO_IMG_URL}></img>
          </Col>
          <Col sm="7">
            <h4 className="w-auto pb-0 mb-0"><em><a href={url} target="_blank">{name}</a></em></h4>
            {repo_url && 
              <p className="text-muted">
                  <a href={repo_url} target="_blank">
                    {repo_url.includes("github") ?
                      <>GitHub{" "}<FontAwesomeIcon icon={faGithub} /></>
                      :
                      <>Repository{" "}<FontAwesomeIcon icon={faArrowCircleRight} /></>
                    }
                  </a>
              </p>
            }
          </Col>
          <Col sm="2" className="d-flex">
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

export const ProjectTab = props => {
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

    request(`/portfolio/project`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  console.log(state)

  return (
    <>
      <AddProjectModal isOpen={modal.addModal} toggle={(refresh=false) => toggleModal("addModal", refresh)} />
      <EditProjectModal isOpen={modal.editModal} toggle={(refresh=false) => toggleModal("editModal", refresh)} id={editIdentifier} />
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Projects</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button className="ml-auto mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <>
              {state.data.projects.length == 0 && 
                <h4 className="w-100 text-muted text-center"><em>No project data found...</em></h4>
              }
              {state.data.projects.length > 0 && state.data.projects.map((project, i) => (
                <Col md="6" className={`ml-auto mr-auto${i > 1 ? " mt-3" : ""}`}>
                  <ProjectCard project={project} toggleModal={(e, id) => openEditModal(e, id)} />
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