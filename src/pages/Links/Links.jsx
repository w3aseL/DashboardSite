import React, { useState } from "react"
import { Container, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from "reactstrap"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { request } from "../../api"
import { Layout } from "../../components"

const LinkModal = ({ modal, toggle, currentlyEdited, ...args }) => {
  const defaultFields = {
    linkName: "",
    linkUrl: "",
    logoUrl: "",
    logoAlt: ""
  }
  
  const [fields, setFields] = useState(defaultFields);

  const updateField = (key, value) => {
    var newFields = { ...fields };

    newFields[key] = value;

    setFields(newFields)
  }

  console.log(fields)

  return (
    <Modal isOpen={modal} toggle={toggle} {...args}>
    <ModalHeader toggle={toggle}>Add Link</ModalHeader>
    <ModalBody>
      <Form>
        <FormGroup>
          <Label for="linkName">
            Link Name
          </Label>
          <Input
            id="linkName"
            name="linkName"
            value={fields.linkName}
            onChange={e => updateField("linkName", e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="linkUrl">
            Link URL
          </Label>
          <Input
            id="linkUrl"
            name="linkUrl"
            value={fields.linkUrl}
            onChange={e => updateField("linkUrl", e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="logoUrl">
            Logo URL
          </Label>
          <Input
            id="logoUrl"
            name="logoUrl"
            value={fields.linkName}
            onChange={e => updateField("logoUrl", e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="logoAlt">
            Logo Alt
          </Label>
          <Input
            id="logoAlt"
            name="logoAlt"
            value={fields.linkName}
            onChange={e => updateField("logoAlt", e.target.value)}
          />
        </FormGroup>
      </Form>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={toggle}>
        Save
      </Button>{' '}
      <Button color="danger" onClick={toggle}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
  );
};

const Links = () => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null
  })
  const [modal, setModal] = useState(false)
  const [currentlyEdited, setCurrentlyEdited] = useState(null)

  const refreshData = () => {
    setState({ ...state, loading: true })

    request(`/link`, null, "GET", true)
    .then(res => {
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  if(!state.loading && !state.data && !state.error) {
    refreshData()
  }

  const toggleModal = () => {
    setModal(!modal);
  }

  const addLink = (e) => {
    e.preventDefault();

    setCurrentlyEdited(null);
    toggleModal();
  }

  const editLink = (e, id) => {
    e.preventDefault();

    setCurrentlyEdited(state.data.find(a => a.id == id));
    toggleModal();
  }

  const deleteLink = (e, id) => {
    e.preventDefault();

  }

  console.log(state)

  return (
    <>
      <LinkModal modal={modal} toggle={toggleModal} currentlyEdited={currentlyEdited} />
      <Layout>
        <Container>
          <Row className="d-flex">
            <Col md="8" className="ml-auto mr-auto mt-4">
              <h2 className="text-center mt-2">Linktree Links</h2>
              <div className="w-100 d-flex mt-2 mb-2">
              <Button
                  size="md"
                  className="btn-simple btn-primary ml-0 mr-2"
                  onClick={e => addLink(e)}
                ><FontAwesomeIcon icon="add" />{" Add"}</Button>
              </div>
              {!state.loading && state.data ?
                <Table>
                  <thead>
                    <th></th>
                    <th>Link Name</th>
                    <th>Link URL</th>
                    <th>Logo URL</th>
                    <th>Logo Alt</th>
                    <th>Alt Icon</th>
                  </thead>
                  <tbody>
                    {state.data.map((link, i) => (
                      <tr>
                        <th>
                          <div className="d-flex">
                            <Button
                              size="sm"
                              className="btn-simple btn-secondary ml-0 mr-2"
                              onClick={e => editLink(e, link.id)}
                            ><FontAwesomeIcon icon="pencil" /></Button>
                            <Button
                              size="sm"
                              className="btn-simple btn-danger mr-2 ml-0"
                              onClick={e => deleteLink(e, link.id)}
                            ><FontAwesomeIcon icon="trash-can" /></Button>
                          </div>
                        </th>
                        <td>{link.linkName}</td>
                        <td>{link.linkUrl}</td>
                        <td>{link.logoUrl}</td>
                        <td>{link.logoAlt}</td>
                        <td><FontAwesomeIcon icon={["fab", link.logoAlt]} /></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              :
                <h1 className="w-100">Loading...</h1>
              }
            </Col>
          </Row>
        </Container>
      </Layout>
    </>
  )
}

export { Links }

export default Links