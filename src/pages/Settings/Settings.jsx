import React, { useState } from "react"
import classnames from "classnames"
import { Table, Container, Row, Col, Button, Card, TabContent, TabPane, Nav, NavItem, NavLink, Form, FormGroup, FormText, Label, Input } from "reactstrap"

import { request } from "../../api"

import { Layout } from "../../components"
import { convertSecToHMS } from "../../helpers"

const ChangePassword = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    oldPass: "",
    newPass: "",
    confirmNewPass: "",
    samePass: false,
    validPass: false,
    fieldsEmpty: true,
    showPasswords: false
  })

  const updateField = (field, value) => {
    var newState = { ...state }

    newState[field] = value

    newState.samePass = newState.oldPass === newState.newPass
    newState.validPass = newState.newPass !== newState.confirmNewPass
    newState.fieldsEmpty = newState.oldPass === "" | newState.newPass === "" | newState.confirmNewPass === ""

    setState({ ...newState })
  }

  const updatePassword = e => {
    e.preventDefault()

    const { oldPass, newPass } = state

    setState({ ...state, loading: true, error: null, data: null })

    request(`/auth/update-password`, { old_password: oldPass, new_password: newPass }, "POST", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  console.log(state)

  return (
    <Container className="mt-3">
      <Row className="d-flex">
        <Col md="8" className="ml-auto mr-auto">
          <h3 className="text-center">Change Password</h3>
          <Form autoComplete="off">
            <FormGroup>
              <Label for="oldPass">Old Password</Label>
              <Input invalid={state.samePass} type={!state.showPasswords ? "password" : "text"} name="oldPassword" id="oldPass" placeholder="Enter old password..." onChange={e => updateField("oldPass", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="newPass">New Password</Label>
              <Input invalid={state.validPass || state.samePass} type={!state.showPasswords ? "password" : "text"} name="newPassword" id="newPass" placeholder="Enter new password..." onChange={e => updateField("newPass", e.target.value)} />
              {state.samePass && <FormText>The password you provided is the same as your old password!</FormText>}
            </FormGroup>
            <FormGroup>
              <Label for="confNewPass">Confirm New Password</Label>
              <Input invalid={state.validPass} type={!state.showPasswords ? "password" : "text"} name="confNewPassword" id="confNewPass" placeholder="Confirm new password..." onChange={e => updateField("confirmNewPass", e.target.value)} />
              {state.validPass && <FormText>The passwords do not match!</FormText>}
            </FormGroup>
            <FormGroup check>
              <Input type="checkbox" name="showPass" id="showPasswords" onChange={e => setState({ ...state, showPasswords: e.target.checked })} />
              <Label for="showPasswords" check>Show Passwords</Label>
            </FormGroup>
          </Form>
          <div className="w-100 d-flex">
            <Button disabled={state.validPass || state.samePass || state.fieldsEmpty} className="ml-auto mr-auto" onClick={e => updatePassword(e)}>Update Password</Button>
          </div>
          {!state.loading && (state.data || state.error) &&
            <div className="w-100 d-flex mt-2">
              {state.error && state.error.response && state.error.response.data && state.error.response.data.message && <p className="w-auto ml-auto mr-0" color="error">{state.error.response.data.message}</p>}
              {state.data && state.data.message && <p className="w-auto ml-auto mr-0">{state.data.message}</p>}
            </div>
          }
        </Col>
      </Row>
    </Container>
  )
}

const Settings = props => {
  const [state, setState] = useState({
    activeTab: 'settings-0'
  })

  const setTab = tab => {
    setState({ ...state, activeTab: tab })
  }

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <Col md="10" className="ml-auto mr-auto mt-3">
            <h1 className="w-100 text-center">Settings</h1>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'settings-0' })}
                  onClick={() => { setTab('settings-0') }}
                >
                  Password
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: state.activeTab === 'settings-1' })}
                  onClick={() => { setTab('settings-1') }}
                >
                  Coming Soon...
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={state.activeTab}>
              <TabPane tabId="settings-0">
                <ChangePassword />
              </TabPane>
              <TabPane tabId="settings-1">
                <Row>
                  <Col sm="12">
                    <h4>Tab 2 Contents</h4>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { Settings }

export default Settings