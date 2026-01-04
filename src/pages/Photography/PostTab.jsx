import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, Form, FormGroup, Input, FormText, Label } from "reactstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"

import { request } from "../../api"

import { Table } from "../../components"


/**
 * AddEducationModal Component
 */
const PostEditModal = ({ toggle, isOpen, editing }) => {
  const initialForm = {
    photoPostId: editing?.photoPostId ?? null,
    name: editing?.name ?? "",
    url: editing?.url ?? "",
    postDate: editing != null && editing.postDate != null ? editing.postDate.split('T')[0] : null
  }

  const [form, setForm] = useState(initialForm)
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })

  useEffect(() => {
    if (editing == null) setForm({ ...initialForm });
    else setForm({ ...editing, postDate: editing != null && editing.postDate != null ? editing.postDate.split('T')[0] : null });
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

    request("/photography/post", form, form.photoPostId == null ? "POST" : "PATCH", true)
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
            <FormGroup>
              <Label for="url">URL</Label>
              <Input type="text" name="url" id="url" placeholder="Enter URL..." value={form.url} onChange={e => updateField("url", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="postDate">Post Date</Label>
              <Input type="date" name="postDate" id="postDate" placeholder="Enter date posted..." value={form.postDate} onChange={e => updateField("postDate", e.target.value)} />
            </FormGroup>
          </Container>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="float-left" onClick={e => submitData(e)}>{form.photoPostId == null ? "Create" : "Save"}</Button>
      </ModalFooter>
    </Modal>
  )
}

export const PostTab = ({ updatePosts }) => {
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

    request(`/photography/post`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
      updatePosts(res.data);
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  return (
    <>
      <PostEditModal toggle={(refresh=false) => toggleModal(refresh)} isOpen={modal} editing={editing} />
      <Container className="mt-3 mb-3">
        <Row>
          <Col md="6" className="d-flex">
            <h4 className="w-100"><em>Edit Posts</em></h4>
          </Col>
          <Col md="6" className="d-flex">
            <Button className="ml-auto mr-0" onClick={e => openAddModal(e)}><FontAwesomeIcon icon={faPlus} />{" "}Add</Button>
          </Col>
        </Row>
        <Row className="d-flex mt-3">
          {!state.loading && state.data ?
            <Table
              data={state.data}
              headers={[ '#', 'Name', 'URL', 'Date Posted', '' ]}
              rowRender={(post, i) => (
                <tr>
                  <th scope="row">{post.photoPostId}</th>
                  <td>{post.name}</td>
                  <td>{post.url}</td>
                  <td>{post.postDate != null ? post.postDate.split('T')[0] : null}</td>
                  <td className="d-flex">
                    <Button className="ml-auto mr-0" onClick={e => openEditModal(e, post)}><FontAwesomeIcon icon={faPencil} />{" "}Edit</Button>
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