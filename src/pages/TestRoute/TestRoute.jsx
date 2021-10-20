import React, { useState } from "react"
import { Table, Container, Row, Col, Button, Form, FormGroup, Input, Label } from "reactstrap"
import JSONPretty from "react-json-pretty"
import PrettyTheme from 'react-json-pretty/themes/monikai.css'

import { request } from "../../api"

import { Layout } from "../../components"

const TestRoute = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    route: "/spotify/test",
    limit: 50,
    offset: 0
  })

  const updateRoute = e => {
    e.preventDefault()

    setState({ ...state, route: e.target.value })
  }

  const runTest = e => {
    e.preventDefault()

    setState({ ...state, loading: true })

    request(state.route, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, error: null })
    })
    .catch(err => setState({ ...state, loading: false, error: err, data: null }))
  }

  console.log(state)

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <h1 className="w-100 text-center">Test Routes</h1>
          <div className="w-100 d-flex mb-3">
            <Form>
              <FormGroup>
                <Label for="route">Route</Label>
                <Input type="text" name="route" id="route" onChange={e => updateRoute(e)} />
              </FormGroup>
            </Form>
            <Button outline color="primary" className="ml-4 mr-auto mt-4 mb-auto" onClick={e => runTest(e)}>Run</Button>
          </div>
          <Col md="10" className="ml-auto mr-auto d-flex flex-column">
            <h3 className="w-100">Result</h3>
            {!state.loading && state.data &&
              <JSONPretty data={state.data} theme={PrettyTheme}></JSONPretty>
            }
            {!state.loading && state.error &&
              <JSONPretty data={state.error} theme={PrettyTheme}></JSONPretty>
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { TestRoute }

export default TestRoute