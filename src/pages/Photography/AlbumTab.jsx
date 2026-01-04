import React, { useEffect, useState } from "react"
import Select from "react-select"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Form, FormGroup, Input, FormText, Label } from "reactstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"

import { request } from "../../api"

import { Table } from "../../components"
import { faX } from "@fortawesome/free-solid-svg-icons/faX"


/**
 * AddEducationModal Component
 */
const AlbumEditModal = ({ toggle, isOpen, editing, tags }) => {
  const initialForm = {
    photoAlbumId: editing?.photoAlbumId ?? null,
    name: editing?.name ?? "",
    tags: editing?.tags.map(t => ({ value: t.photoTagId, label: t.name })) ?? [],
    isPublished: editing?.isPublished ?? false
  }

  const [form, setForm] = useState(initialForm)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  useEffect(() => {
    if (editing == null) setForm({ ...initialForm });
    else setForm({ ...editing, tags: editing?.tags.map(t => ({ value: t.photoTagId, label: t.name })) ?? [] });
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

    request("/photography/album", { ...form, tagIds: form.tags.map(t => t.value) }, form.photoAlbumId == null ? "POST" : "PATCH", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })

      closeModal(true)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const closeModal = (refresh=false) => {
    setState({ ...state, loading: false, data: null, error: null })
    setForm(initialForm)

    toggle(refresh)
  }

  console.log({ form, editing, tags })

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
                checked={form.isPublished}
                onChange={() => {
                  updateField("isPublished", !form.isPublished)
                }}
              />
              <Label check>Mark as Published?</Label>
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
          </Container>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => submitData(e)}>{form.photoAlbumId == null ? "Create" : "Save"}</Button>
      </ModalFooter>
    </Modal>
  )
}

export const AlbumTab = ({ updateAlbums, tags }) => {
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

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/photography/album`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
      updateAlbums(res.data);
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <>
      <AlbumEditModal toggle={(refresh=false) => toggleModal(refresh)} isOpen={modal} editing={editing} tags={tags} />
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Albums</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button className="ml-auto mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <Table
              data={state.data}
              headers={[ '#', 'Name', 'Slug', 'Published?', '' ]}
              rowRender={(album, i) => (
                <tr>
                  <th scope="row">{album.photoAlbumId}</th>
                  <td>{album.name}</td>
                  <td>{album.slug}</td>
                  <td>{album.isPublished ? <FontAwesomeIcon icon={faBook} /> : <FontAwesomeIcon icon={faX} />}</td>
                  <td className="d-flex">
                    <Button className="ml-auto mr-0" onClick={e => openEditModal(e, album)}><FontAwesomeIcon icon={faPencil} />{" "}Edit</Button>
                  </td>
                </tr>
              )}
              offset={0}
              limit={state.data.length}
              limitOptions={[ state.data.length ]}
              total={state.data.length}
            />
          :
            <h1 className="w-100">Loading...</h1>
          }
        </Row>
      </Container>
    </>
  )
}