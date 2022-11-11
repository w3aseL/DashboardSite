import React, { useState } from "react"
import { Table, Container, Row, Col, Button } from "reactstrap"

import { request } from "../../api"

import { Layout } from "../../components"

const Metrics = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    limit: 50,
    offset: 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/tracking/stats`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const nextSongs = event => {
    event.preventDefault()

    const offset = state.offset + state.limit

    setState({ ...state, loading: true, data: null })

    request(`/tracking/stats?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const prevSongs = event => {
    event.preventDefault()

    const offset = state.offset - state.limit

    setState({ ...state, loading: true, data: null })

    request(`/tracking/stats?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  // console.log(state)

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <h1 className="w-100 text-center">Metrics</h1>
          <div className="w-100 d-flex mb-3">
            <Button outline color="secondary" disabled={!(state.data && state.offset > 0)} className="ml-auto mr-1" onClick={e => prevSongs(e)}>Previous</Button>
            <Button outline color="secondary" disabled={!(state.data && state.data.next)} className="ml-1 mr-auto" onClick={e => nextSongs(e)}>Next</Button>
          </div>
          <Col md="10" className="ml-auto mr-auto d-flex">
            {!state.loading && state.data ?
              <Table>
                <thead>
                  <th>#</th>
                  <th>Route</th>
                  <th>Method</th>
                  <th>Status Code</th>
                  <th>Timestamp</th>
                </thead>
                <tbody>
                  {state.data.records.map((metric, i) => (
                    <tr>
                      <th scope="row">{state.offset+i+1}</th>
                      <td>{metric.route}</td>
                      <td>{metric.method}</td>
                      <td>{metric.statusCode}</td>
                      <td>{new Date(metric.timestamp).toLocaleString({ language: "en-US" })}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            :
              <h3 className="w-100">Loading...</h3>
            }
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export { Metrics }

export default Metrics