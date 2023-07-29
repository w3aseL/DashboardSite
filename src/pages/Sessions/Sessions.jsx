import React, { useState } from "react"
import { Container, Row, Col, Button } from "reactstrap"

import { request } from "../../api"

import { Layout, Table } from "../../components"
import { convertSecToHMS } from "../../helpers"

const url = new URL(window.location);

const updateSearchParam = (key, value) => {
  url.searchParams.set(key, value);
  window.history.pushState({ path: url.toString() },'', url.toString());
}

const getSearchParam = (key) => {
  return url.searchParams.get(key);
}

const Sessions = () => {
  if (getSearchParam("limit") == null) updateSearchParam("limit", 20)

  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    limit: Number(getSearchParam("limit")) ?? 20,
    offset: Number(getSearchParam("offset")) ?? 0
  })

  if(!state.loading && !state.data && !state.error) {
    setState({ ...state, loading: true })

    request(`/spotify/data/sessions?limit=${state.limit}&offset=${state.offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const refreshSessions = limit => {
    setState({ ...state, loading: true, data: null })

    request(`/spotify/data/sessions?limit=${limit}&offset=${state.offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, limit })
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const refreshSessionsByOffset = offset => {
    setState({ ...state, loading: true, data: null })

    request(`/spotify/data/sessions?limit=${state.limit}&offset=${offset}`, null, "GET", true)
    .then(res => {  
      setState({ ...state, loading: false, data: res.data, offset })
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
      updateSearchParam("offset", offset)
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
      updateSearchParam("offset", offset)
    })
    .catch(err => setState({ ...state, loading: false, error: err }))
  }

  const updateLimit = event => {
    var limit = Number(event.target.value)

    updateSearchParam("limit", limit)

    refreshSessions(limit)
  }

  const updateOffset = (event, offset) => {
    event.preventDefault()

    updateSearchParam("offset", offset)

    refreshSessionsByOffset(offset)
  }

  return (
    <Layout>
      <Container>
        <Row className="d-flex">
          <h1 className="w-100 text-center">Sessions</h1>
          <Col md="10" className="ml-auto mr-auto mb-5 d-flex">
            {!state.loading && state.data ?
              <Table
                  data={state.data.sessions}
                  headers={[ '#', 'Start Time', 'End Time', 'Duration', 'Song Count', 'Link' ]}
                  rowRender={(session, i) => (
                    <tr>
                      <th scope="row">{state.offset+i+1}</th>
                      <td>{new Date(session.startTime).toLocaleString()}</td>
                      <td>{new Date(session.endTime).toLocaleString()}</td>
                      <td>{convertSecToHMS(session.timeListening)}</td>
                      <td>{session.songCount}</td>
                      <td><a href={`/session/${session.sessionId}`}><em>{"Click to View"}</em></a></td>
                    </tr>
                  )}
                  offset={state.offset}
                  limit={state.limit}
                  limitOptions={[ 10, 20, 40 ]}
                  total={state.data.totalCount}
                  updateLimit={updateLimit}
                  updateOffset={updateOffset}
                  previous={prevSessions}
                  next={nextSessions}
                  />
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