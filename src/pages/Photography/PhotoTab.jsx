import React, { useEffect, useState } from "react"
import Select from "react-select"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Form, FormGroup, Input, FormText, Label } from "reactstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"

import { request } from "../../api"

import { Table } from "../../components"


/**
 * AddEducationModal Component
 */
const PhotoEditModal = ({ toggle, isOpen, editing, tags, posts, albums }) => {
  const initialForm = {
    photoId: editing?.photoId ?? null,
    name: editing?.name ?? "",
    tags: editing?.tags.map(t => ({ value: t.photoTagId, label: t.name })) ?? [],
    post: editing != null && editing.featuredPost != null ? { value: editing.featuredPost.photoPostId, label: editing.featuredPost.name } : null,
    albums: editing?.albums.map(t => ({ value: t.photoAlbumId, label: t.name })),
    isFavorite: editing?.isFavorite ?? false,
    originalImage: editing?.originalImage ?? null,
    rawImage: editing?.rawImage ?? null,
    finalImage: editing?.finalImage ?? null
  }

  const [form, setForm] = useState(initialForm)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const [originalImage, setOriginalImage] = useState(null)
  const [rawImage, setRawImage] = useState(null)
  const [finalImage, setFinalImage] = useState(null)

  useEffect(() => {
    if (editing == null) setForm({ ...initialForm });
    else setForm({
      ...editing,
      tags: editing?.tags.map(t => ({ value: t.photoTagId, label: t.name })) ?? [],
      post: editing != null && editing.featuredPost != null ? { value: editing.featuredPost.photoPostId, label: editing.featuredPost.name } : null,
      albums: editing?.albums.map(t => ({ value: t.photoAlbumId, label: t.name }))
    });
  }, [editing]);

  const updateField = (field, value) => {
    const newForm = { ...form }

    newForm[field] = value

    setForm(newForm)
  }

  const validateForm = () => {
    let valid = true;

    Object.keys(form).forEach(key => {
      if(typeof(form[key]) === "string" && key !== "url" && form[key].length === 0)
        valid = false
    });

    return valid;
  }

  const submitData = e => {
    e.preventDefault()

    if(!validateForm())
      return

    setState({ ...state, loading: true, data: null, error: null })

    request("/photography/photo", { ...form, tagIds: form.tags.map(t => t.value), photoPostId: form.post?.value ?? null, albumIds: form.albums.map(t => t.value) }, form.photoId == null ? "POST" : "PATCH", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      updateField("photoId", res.data.photoId)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const getImageByType = type => {
    if (type == "original") return originalImage;
    if (type == "raw") return rawImage;
    if (type == "final") return finalImage;

    return null;
  }

  const uploadImage = (e, photoType) => {
    e.preventDefault()

    var image = getImageByType(photoType);

    if(!image)
      return

    var formData = new FormData()
    formData.append("photo", image)
    formData.append("photoId", form.photoId)
    formData.append("photoType", photoType)

    setState({ ...state, loading: true })

    request("/photography/photo/upload", formData, "POST", true, "multipart/form-data")
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      updateField(`${photoType}Image`, res.data)
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
      <ModalHeader toggle={() => closeModal()}>Add/Edit Information</ModalHeader>
      <ModalBody>
        <Form>
          <Container>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" name="name" id="name" placeholder="Enter post name..." value={form.name} onChange={e => updateField("name", e.target.value)} />
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="checkbox"
                checked={form.isFavorite}
                onChange={() => {
                  updateField("isFavorite", !form.isFavorite)
                }}
              />
              <Label check>Is Favorite?</Label>
            </FormGroup>
            <FormGroup>
              <Label for="tagIds">
                Tags
              </Label>
              <Select
                id="tagIds"
                isMulti
                value={form.tags}
                options={tags.map(t => ({ value: t.photoTagId, label: t.name }))}
                onChange={val => updateField("tags", val)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="postIds">
                Post
              </Label>
              <Select
                id="postIds"
                isClearable={true}
                value={form.post}
                options={posts.map(t => ({ value: t.photoTagId, label: t.name }))}
                onChange={val => updateField("post", val)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="albumIds">
                Albums
              </Label>
              <Select
                id="albumIds"
                isMulti
                value={form.albums}
                options={albums.map(t => ({ value: t.photoAlbumId, label: t.name }))}
                onChange={val => updateField("albums", val)}
              />
            </FormGroup>
            <div className="d-flex">
              <Button className="ml-auto mr-0" onClick={e => submitData(e)}>{form.photoId == null ? "Create" : "Save"}</Button>
            </div>
            {form.photoId != null &&
              <>
                <hr/>
                <div className="d-flex flex-column">
                  <h4>Upload Original Image</h4>
                  <FormGroup>
                    <Input type="file" name="originalImage" id="originalImage" onChange={e => setOriginalImage(e.target.files[0])} />
                    <FormText>Image Identifier: {form.originalImage != null ? form.originalImage.uuid : "N/A"}</FormText>
                  </FormGroup>
                  <div className="w-100 d-flex">
                    <Button size="sm" disabled={form.originalImage == null} href={form.originalImage != null && form.originalImage.url} target="_blank">Preview</Button>
                    <Button size="sm" className="ml-auto mr-0" onClick={e => uploadImage(e, "original")}>Upload Image</Button>
                  </div>
                </div>
                <hr/>
                <div className="d-flex flex-column">
                  <h4>Upload RAW Image</h4>
                  <FormGroup>
                    <Input type="file" name="rawImage" id="rawImage" onChange={e => setRawImage(e.target.files[0])} />
                    <FormText>Image Identifier: {form.rawImage != null ? form.rawImage.uuid : "N/A"}</FormText>
                  </FormGroup>
                  <div className="w-100 d-flex">
                    <Button size="sm" className="ml-auto mr-0" onClick={e => uploadImage(e, "raw")}>Upload Image</Button>
                  </div>
                </div>
                <hr/>
                <div className="d-flex flex-column">
                  <h4>Upload Final Image</h4>
                  <FormGroup>
                    <Input type="file" name="finalImage" id="finalImage" onChange={e => setFinalImage(e.target.files[0])} />
                    <FormText>Image Identifier: {form.finalImage != null ? form.finalImage.uuid : "N/A"}</FormText>
                  </FormGroup>
                  <div className="w-100 d-flex">
                    <Button size="sm" disabled={form.finalImage == null} href={form.finalImage != null && form.finalImage.url} target="_blank">Preview</Button>
                    <Button size="sm" className="ml-auto mr-0" onClick={e => uploadImage(e, "final")}>Upload Image</Button>
                  </div>
                </div>
              </>
            }
          </Container>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={() => closeModal(true)}>Close</Button>
      </ModalFooter>
    </Modal>
  )
}

export const PhotoTab = ({ tags, albums, posts }) => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)

  const toggleModal = (refresh=false) => {
    setModal(!modal)

    if(refresh) {
      setState({ ...state, loading: false, data: null, error: null })
    }
  }

  const openAddModal = e => {
    e.preventDefault()

    setEditing(null)

    // Open modal
    toggleModal()
  }

  const openEditModal = (e, tag) => {
    e.preventDefault()

    setEditing(tag)

    // Open modal
    toggleModal()
  }

  const getPhotoSource = photo => {
    if (photo.finalImage != null) return photo.finalImage.url;
    if (photo.originalImage != null) return photo.originalImage.url;

    return "";
  }

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/photography/photo`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <>
      <PhotoEditModal toggle={(refresh=false) => toggleModal(refresh)} isOpen={modal} editing={editing} tags={tags} albums={albums} posts={posts} />
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Photos</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button className="ml-auto mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <>
              {state.data.map((photo, i) => (
                <Col md="4" xs="12" className="d-flex flex-column">
                  <h4>{photo.name}</h4>
                  <img className="mt-1 mb-3" src={getPhotoSource(photo)} />
                  <div className="d-flex mt-auto mb-0">
                    <Button className="ml-auto mr-0" onClick={e => openEditModal(e, photo)}><FontAwesomeIcon icon={faPencil} />{" "}Edit</Button>
                  </div>
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