import React, { useEffect, useState } from "react"
import { connect } from "react-redux"

import { request } from "../../api"
import { loginUser } from "../../redux/auth/actions"
import { convertSecToHMS } from "../../helpers"

import { Container, Row, Col, Card, Input, InputGroup, Button } from "reactstrap"
import Layout from "../../components/Layout"
import { history } from "../../helpers/history"

const RegisterComp = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    registrationRequested: false,
    showPassword: false
  })
  const [timeLeft, setTimeLeft] = useState(-1)
  const [form, setForm] = useState({
    registrationPassword: "",
    displayName: "",
    username: "",
    password: ""
  })
  const [messages, setMessages] = useState({
    errorMsg: ""
  })
  const [registerState, setRegisterState] = useState({
    loading: false,
    data: null,
    error: null
  })

  const countdown = () => {
    var seconds = timeLeft - 1

    if(seconds == 0) {
      setState({ ...state, registrationRequested: false, data: null, error: null })
      setTimeLeft(-1)
    } else if(seconds > 0) {
      setTimeLeft(seconds)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => countdown(), 1000)
    return () => clearInterval(timer)
  })

  const requestAccountCreation = e => {
    e.preventDefault()

    if(state.registrationRequested)
      return

    setState({ ...state, loading: true, error: null, data: null, registrationRequested: false })

    request(`/auth/request-registration`, null, "GET", false)
    .then(res => {
      var newState = { ...state }

      newState.loading = false
      newState.data = res.data
      newState.registrationRequested = true

      setState({ ...newState })
      setTimeLeft(300)

      setTimeout(() => countdown(), 1000)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const updateField = (field, value) => {
    var newForm = { ...form }

    newForm[field] = value

    setForm({ ...newForm })
    
    if(messages.errorMsg !== "")
      setMessages({ ...messages, errorMsg: "" })
  }

  const submitForm = event => {
    event.preventDefault()

    const { username, password, displayName, registrationPassword } = form, { dispatch } = props

    if(username && password && displayName && registrationPassword) {
      setRegisterState({ ...registerState, loading: true, data: null, error: null })

      request(`/auth/register`, { username, password, display_name: displayName, register_password: registrationPassword }, "POST", false)
      .then(res => {
        setRegisterState({ ...registerState, loading: false, data: res.data })

        setTimeout(() => dispatch(loginUser({ username, password }), 10000))
      })
      .catch(err => setRegisterState({ ...registerState, loading: false, error: err }))
    } else {
      setMessages({ ...messages, errorMsg: "One of the fields is not complete!" })
    }
  }

  const { loggedIn, error } = props

  if(loggedIn)
    history.push('/dashboard')

  console.log(state, timeLeft, form, messages)

  return (
    <Layout>
      <Container className="mt-5">
        <Row className="d-flex">
          <Col md="8" className="ml-auto mr-auto">
            <Card>
              <Container>
                <Row className="d-flex">
                  <Col md="9" className="ml-auto mr-auto">
                    <h2 className="mt-2 mb-2 text-center">Register</h2>
                    <hr />
                    <div className="w-100 d-flex mb-3">
                      <Button disabled={state.registrationRequested} className="ml-auto mr-auto" onClick={e => requestAccountCreation(e)}>Request Registration</Button>
                    </div>
                    {state.registrationRequested && state.data &&
                      <div className="w-100 d-flex">
                        <p className="w-auto ml-auto mr-auto">Registration requested! Time left till expiration: {convertSecToHMS(timeLeft)}</p>
                      </div>
                    }
                    {state.registrationRequested &&
                    <>
                      <hr />
                      <label className="mb-1">Registration Password</label>
                      <Input
                        placeholder="Enter registration password..."
                        onChange={e => updateField("registrationPassword", e.target.value)}
                        type={state.showPassword ? "text" : "password"}
                        className="mb-3"
                      />
                      <label className="mb-1">Display Name</label>
                      <Input
                        placeholder="Enter display name..."
                        onChange={e => updateField("displayName", e.target.value)}
                        type="text"
                        className="mb-3"
                      />
                      <label className="mb-1">Username</label>
                      <Input
                        placeholder="Enter username..."
                        onChange={e => updateField("username", e.target.value)}
                        type="text"
                        className="mb-3"
                      />
                      <label className="mb-1">Password</label>
                      <Input
                        placeholder="Enter password..."
                        onChange={e => updateField("password", e.target.value)}
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
                      {messages.errorMsg !== "" &&
                        <div className="w-100 d-flex">
                          <p className="w-auto ml-auto mr-0">{messages.errorMsg}</p>
                        </div>
                      }
                      {registerState.data && registerState.data.message &&
                        <div className="w-100 d-flex">
                          <p className="w-auto ml-auto mr-0">{registerState.data.message}</p>
                          <p className="w-auto ml-auto mr-0"><em>Logging in automatically in 5 seconds...</em></p>
                        </div>
                      }
                    </>
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

export const Register = connect(mapStateToProps)(RegisterComp)

export default Register