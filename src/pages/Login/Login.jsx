import React, { useState } from "react"
import { connect } from "react-redux"

import { loginUser } from "../../redux/auth/actions"

import { Container, Row, Col, Card, Input, InputGroup, Button } from "reactstrap"
import Layout from "../../components/Layout"
import { history } from "../../helpers/history"

const LoginComp = props => {
  const [state, setState] = useState({
    username: "",
    password: "",
    showPassword: false
  })

  const submitForm = event => {
    event.preventDefault()

    const { dispatch } = props, { username, password } = state

    console.log(props)

    if(username && password)
      dispatch(loginUser({ username, password }))
    else
      console.log("One of the forms are not filled out!")
  }

  const { loggedIn, error } = props

  if(loggedIn)
    history.push('/dashboard')

  return (
    <Layout>
      <Container className="mt-5">
        <Row className="d-flex">
          <Col md="8" className="ml-auto mr-auto">
            <Card>
              <Container>
                <Row className="d-flex">
                  <Col md="9" className="ml-auto mr-auto">
                    <h2 className="mt-2 mb-2 text-center">Login</h2>
                    <hr />
                    <label className="mb-1">Username</label>
                    <Input
                      placeholder="Enter username..."
                      onChange={event => setState({ ...state, username: event.target.value })}
                      type="text"
                      className="mb-3"
                    />
                    <label className="mb-1">Password</label>
                    <Input
                      placeholder="Enter password..."
                      onChange={event => setState({ ...state, password: event.target.value })}
                      type={state.showPassword ? "text" : "password"}
                      className="mb-3"
                    />
                    <InputGroup className="form-check">
                      <label>
                        <Input 
                          type="checkbox"
                          onChange={event => setState({ ...state, showPassword: !state.showPassword })}
                          id="showPassCheckbox"
                        />
                        Show Password
                      </label>
                    </InputGroup>
                    <div className="w-100 d-flex">
                      <Button
                        className="ml-auto mr-0 mb-3"
                        onClick={event => submitForm(event)}
                      >
                        Submit
                      </Button>
                    </div>
                    {error &&
                      <div className="w-100 d-flex">
                        {error && error.response && error.response.data && error.response.data.message && <p className="w-auto ml-auto mr-0">{error.response.data.message}</p>}
                      </div>
                    }
                  </Col>
                </Row>
              </Container>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
  error: state.auth.error
})

export const Login = connect(mapStateToProps)(LoginComp)

export default Login