import React, { useState } from "react"
import classnames from "classnames"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync, faTrash } from "@fortawesome/free-solid-svg-icons"

import { request } from "../../api"

const ImageDeleteModal = ({ isOpen, toggle, images }) => {
  const [dropdown, setDropdown] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [clickedDelete, setClickedDelete] = useState(false)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const toggleDropdown = () => setDropdown(prevState => !prevState)

  const updateSelectedImage = (e, image) => {
    e.preventDefault()

    setSelectedImage(image)
    setClickedDelete(false)
  }

  const requestDelete = e => {
    e.preventDefault()

    setClickedDelete(true)
  }

  const closeModal = (refresh=false) => {
    setDropdown(false)
    setSelectedImage(null)
    setClickedDelete(false)
    setState({ ...state, loading: false, data: null, error: null })

    toggle(refresh)
  }

  const deleteImage = e => {
    e.preventDefault()

    const { id } = selectedImage

    setState({ ...state, loading: true })

    request(`/portfolio/image`, { id }, "DELETE", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <Modal isOpen={isOpen} toggle={() => closeModal()}>
      <ModalHeader toggle={() => closeModal()}>Delete Image</ModalHeader>
      <ModalBody>
        <Container>
          <Row className="d-flex">
            <Col sm="4">
              <img src={selectedImage ? selectedImage.url : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"} width="100%" height="auto" />
            </Col>
            <Col sm="8" className="d-flex flex-column">
              <div className="d-flex w-100">
                <Dropdown className="ml-auto mr-auto" color="primary" isOpen={dropdown} toggle={toggleDropdown}>
                  <DropdownToggle caret>
                    {!selectedImage ? "Select Image" : selectedImage.file_name}
                  </DropdownToggle>
                  <DropdownMenu>
                    {images.length === 0 &&
                      <DropdownItem disabled>N/A</DropdownItem>
                    }
                    {images.length > 0 && images.map((img, i) => (
                      <DropdownItem onClick={e => updateSelectedImage(e, img)}>{img.file_name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <p className="text-center text-muted w-100">Image Identifier: {selectedImage ? selectedImage.id : "N/A"}</p>
              <div className="d-flex w-100 mt-auto mb-0">
                <Button disabled={!selectedImage} size="sm" color="danger" className="ml-auto mr-0" onClick={e => requestDelete(e)}>Delete Image</Button>
              </div>
            </Col>
          </Row>
        </Container>  
      </ModalBody>
      {clickedDelete &&
        <ModalFooter>
          <p className="text-center w-100"><em>Are you sure you want to delete this image?</em></p>
          <Button disabled={!selectedImage} color="danger" className="ml-auto mr-0" onClick={e => deleteImage(e)}>Delete It.</Button>
        </ModalFooter>
      }
    </Modal>
  )
}

const ImageCard = ({ image }) => {
  const { id, url, file_name } = image

  return (
    <Card>
      <Container>
        <Row className="d-flex">
          <Col sm="8" className="ml-auto mr-auto">
            <img width="100%" height="auto" src={url}></img>
          </Col>
        </Row>
        <Row className="d-flex">
          <Col sm="10" className="ml-auto mr-auto">
            <h4 className="w-100 pb-0 mb-0 text-center"><em>{file_name}</em></h4>
            <p className="w-100 text-muted text-center">{id}</p>
            <p className="w-100 text-muted text-center"><em>{url}</em></p>
          </Col>
        </Row>
      </Container>
    </Card>
  )
}

export const ImageTab = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [modal, toggleModal] = useState(false)

  const refreshImages = e => {
    e.preventDefault()

    setState({ ...state, loading: false, data: null, error: null })
  }

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/portfolio/image`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const toggle = (refresh=false) => {
    if(refresh)
      setState({ ...state, loading: false, data: null, error: null })

    toggleModal(!modal)
  }

  const openModal = e => {
    e.preventDefault()

    toggle()
  }

  //console.log(state)

  return (
    <>
      <ImageDeleteModal isOpen={modal} toggle={(refresh=false) => toggle(refresh)} images={state.data ? state.data.images : []} />
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="6">
            <h4 className="w-100"><em>Manage Images</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button color="danger" className="ml-auto mr-1" onClick={e => openModal(e)}><FontAwesomeIcon icon={faTrash} /></Button>
            <Button className="ml-2 mr-0" onClick={e => refreshImages(e)}><FontAwesomeIcon icon={faSync} /></Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <>
              {state.data.images.length == 0 && 
                <h4 className="w-100 text-muted text-center"><em>No images found...</em></h4>
              }
              {state.data.images.map((obj, i) => (
                <Col md="4" className={`ml-auto mr-auto${i > 2 ? " mt-3" : ""}`}>
                  <ImageCard image={obj} />
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