import React, { useState } from "react"
import { Table, Container, Row, Col, Button } from "reactstrap"

import { request } from "../../api"

import { Layout } from "../../components"
import { convertSecToHMS } from "../../helpers"

const Sessions = props => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    limit: 10,
    offset: 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/data/sessions`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const nextSessions = event => {
    event.preventDefault()

    const offset = state.offset + state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/data/sessions?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const prevSessions = event => {
    event.preventDefault()

    const offset = state.offset - state.limit

    setState({ ...state, loading: true, data: null })

    request(`/spotify/data/sessions?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  console.log(state)

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <h1 className="w-100 text-center">Sessions</h1>
          <div className="w-100 d-flex mb-3">
            <Button outline color="secondary" disabled={!(state.data && state.offset > 0)} className="ml-auto mr-1" onClick={e => prevSessions(e)}>Previous</Button>
            <Button outline color="secondary" disabled={!(state.data && state.data.next)} className="ml-1 mr-auto" onClick={e => nextSessions(e)}>Next</Button>
          </div>
          <Col md="10" className="ml-auto mr-auto d-flex">
            {!state.loading && state.data ?
              <Table>
                <thead>
                  <th>#</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                  <th>Song Count</th>
                  <th>Link</th>
                </thead>
                <tbody>
                  {state.data.map((session, i) => (
                    <tr>
                      <th scope="row">{state.offset+i+1}</th>
                      <td>{new Date(session.startTime).toLocaleString()}</td>
                      <td>{new Date(session.endTime).toLocaleString()}</td>
                      <td>{convertSecToHMS(session.timeListening)}</td>
                      <td>{session.songCount}</td>
                      <td><a href={`/session/${session.sessionId}`}><em>{"Click to View"}</em></a></td>
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

export { Sessions }

export default Sessions