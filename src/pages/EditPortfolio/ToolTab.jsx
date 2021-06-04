import React, { useState } from "react"
import classnames from "classnames"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Form, FormGroup, Input, FormText, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons"

import { request } from "../../api"

const AddToolModal = ({ isOpen, toggle }) => {
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    logo_id: "",
    category: ""
  })
  const [logo, setLogo] = useState(null)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const closeModal = (refresh=false) => {
    setForm({
      name: "",
      url: "",
      description: "",
      logo_id: "",
      category: ""
    })
    setLogo(null)
    setState({
      loading: false,
      data: null,
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

    setState({ ...state, loading: true })

    request("/portfolio/tool/upload-image", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      updateField("logo_id", res.data.id)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const validateForm = () => {
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

    setState({ ...state, loading: true, data: null, error: null })

    request("/portfolio/tool", form, "POST", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      closeModal()
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Add Tool</ModalHeader>
      <ModalBody>
        <Form>
          <Container>
            <Row>
              <Col sm="4">
                <img src={logo ? URL.createObjectURL(logo) : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"} width="100%" height="auto" />
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
          </Container>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => submitData(e)}>Create</Button>
      </ModalFooter>
    </Modal>
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

  return (
    <>
      <AddToolModal isOpen={modal.addModal} toggle={(refresh=false) => toggleModal("addModal", refresh)} />
      <Container className="mt-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Tools</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button className="ml-auto mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}